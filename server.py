import os
import json
import urllib.request
import urllib.parse
import urllib.error
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8080
ASAAS_BASE_URL = "https://api.asaas.com/v3"


def load_env_key():
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("ASAAS_API_KEY="):
                    return line.split("=", 1)[1].strip()
    return os.environ.get("ASAAS_API_KEY", "")


ASAAS_API_KEY = load_env_key()


def asaas_get(endpoint, params=None):
    url = f"{ASAAS_BASE_URL}{endpoint}"
    if params:
        query_string = urllib.parse.urlencode(params)
        url = f"{url}?{query_string}"

    req = urllib.request.Request(
        url,
        headers={
            "access_token": ASAAS_API_KEY,
            "Content-Type": "application/json",
            "User-Agent": "PilterTecnologiaPortal/1.0"
        },
        method="GET"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


class PilterPortalHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/faturas":
            self.handle_faturas_lookup(parsed.query)
            return

        return super().do_GET()

    def send_json(self, status_code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def handle_faturas_lookup(self, raw_query):
        qs = urllib.parse.parse_qs(raw_query)
        query = (qs.get("q", [""])[0] or "").strip()

        if len(query) < 3:
            self.send_json(400, {
                "ok": False,
                "error": "Informe um CPF, CNPJ ou Nome com pelo menos 3 caracteres."
            })
            return

        digits = "".join(ch for ch in query if ch.isdigit())
        is_cpf_cnpj = len(digits) in (11, 14)

        try:
            customers = []
            if is_cpf_cnpj:
                res = asaas_get("/customers", {"cpfCnpj": digits, "limit": 10})
                customers = res.get("data", [])
            else:
                # Search by name or company name
                res = asaas_get("/customers", {"name": query, "limit": 10})
                customers = res.get("data", [])
                if not customers and len(digits) >= 5:
                    res_doc = asaas_get("/customers", {"cpfCnpj": digits, "limit": 10})
                    customers = res_doc.get("data", [])

            if not customers:
                self.send_json(200, {
                    "ok": True,
                    "customers": [],
                    "invoices": [],
                    "message": "Nenhum cadastro encontrado para os dados informados."
                })
                return

            all_invoices = []
            customer_summaries = []

            for cust in customers[:5]:
                cust_id = cust.get("id")
                cust_name = cust.get("name") or cust.get("company") or "Cliente Pilter"
                cust_doc = cust.get("cpfCnpj") or ""
                # Mask document partially for privacy
                masked_doc = cust_doc
                if len(cust_doc) == 11:
                    masked_doc = f"***.{cust_doc[3:6]}.{cust_doc[6:9]}-**"
                elif len(cust_doc) == 14:
                    masked_doc = f"{cust_doc[:2]}.{cust_doc[2:5]}.{cust_doc[5:8]}/****-{cust_doc[12:]}"

                customer_summaries.append({
                    "id": cust_id,
                    "name": cust_name,
                    "cpfCnpjMasked": masked_doc
                })

                # Fetch PENDING and OVERDUE payments first, plus recent RECEIVED if needed
                for status_filter in ("OVERDUE", "PENDING"):
                    pay_res = asaas_get("/payments", {
                        "customer": cust_id,
                        "status": status_filter,
                        "limit": 20
                    })
                    for p in pay_res.get("data", []):
                        all_invoices.append({
                            "id": p.get("id"),
                            "customerName": cust_name,
                            "customerDoc": masked_doc,
                            "description": p.get("description") or "Serviços de Tecnologia & Conectividade Pilter",
                            "value": p.get("value"),
                            "dueDate": p.get("dueDate"),
                            "status": p.get("status"),
                            "billingType": p.get("billingType"),
                            "invoiceUrl": p.get("invoiceUrl"),
                            "bankSlipUrl": p.get("bankSlipUrl"),
                            "nossoNumero": p.get("nossoNumero"),
                            "invoiceNumber": p.get("invoiceNumber")
                        })

            # Sort invoices by dueDate ascending
            all_invoices.sort(key=lambda x: x.get("dueDate") or "9999-99-99")

            self.send_json(200, {
                "ok": True,
                "customers": customer_summaries,
                "invoices": all_invoices
            })

        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            self.send_json(502, {
                "ok": False,
                "error": f"Erro ao consultar o Asaas (HTTP {e.code}). Verifique os dados ou fale no WhatsApp.",
                "details": err_body
            })
        except Exception as e:
            self.send_json(500, {
                "ok": False,
                "error": f"Não foi possível concluir a consulta no momento: {str(e)}"
            })


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadingHTTPServer(("0.0.0.0", PORT), PilterPortalHandler)
    print(f"Servidor Pilter Tecnologia + Portal Asaas rodando em http://localhost:{PORT}")
    server.serve_forever()
