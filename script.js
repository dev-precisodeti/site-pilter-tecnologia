/**
 * PILTER TECNOLOGIA — ANTIGRAVITY WHITE INTERACTIVE ENGINE & WHATSAPP INTEGRATION
 * Official WhatsApp Target: +55 21 98105-7448
 */

const WHATSAPP_NUMBER = '5521981057448';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Dynamic Footer Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. LGPD Cookie Consent & Legal Modals
  initLgpdCompliance();

  // 4. Floating Pill Header & Mobile Menu
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 5. Scenarios Architecture Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(`tab-${targetTab}`);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });

  // 6. Quick-Select Service Buttons -> Pre-fill contact form & scroll to #contato
  const serviceSelectEl = document.getElementById('servico');
  const contactSection = document.getElementById('contato');

  document.querySelectorAll('[data-select-service]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedService = btn.getAttribute('data-select-service');

      if (serviceSelectEl && selectedService) {
        let matched = false;
        Array.from(serviceSelectEl.options).forEach((opt) => {
          if (opt.value === selectedService) {
            serviceSelectEl.value = selectedService;
            matched = true;
          }
        });
        if (!matched) {
          const customOpt = document.createElement('option');
          customOpt.value = selectedService;
          customOpt.textContent = selectedService;
          serviceSelectEl.appendChild(customOpt);
          serviceSelectEl.value = selectedService;
        }
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const nomeInput = document.getElementById('nome');
          if (nomeInput) nomeInput.focus();
        }, 600);
      }
    });
  });

  // 7. Interactive Solution Simulator / Configurator
  const simProfile = document.getElementById('simProfile');
  const simServices = document.getElementById('simServices');
  const simScale = document.getElementById('simScale');
  const simRecTitle = document.getElementById('simRecTitle');
  const simRecDesc = document.getElementById('simRecDesc');
  const simSendWhatsapp = document.getElementById('simSendWhatsapp');

  function updateSimulatorRecommendation() {
    if (!simProfile || !simServices || !simScale) return;

    const profile = simProfile.querySelector('.sim-chip.active')?.getAttribute('data-val') || 'Empresa';
    const activeServices = Array.from(simServices.querySelectorAll('.sim-chip.active')).map((el) =>
      el.getAttribute('data-val')
    );
    const scale = simScale.querySelector('.sim-chip.active')?.getAttribute('data-val') || '';

    const servicesText = activeServices.length > 0 ? activeServices.join(' + ') : 'Consultoria Personalizada';

    if (simRecTitle) {
      simRecTitle.textContent = `${servicesText} para ${profile}`;
    }
    if (simRecDesc) {
      simRecDesc.textContent = `Arquitetura dimensionada para ${scale.toLowerCase()}, com atendimento direto pela engenharia Pilter.`;
    }
  }

  [simProfile, simScale].forEach((group) => {
    if (!group) return;
    group.querySelectorAll('.sim-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        group.querySelectorAll('.sim-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        updateSimulatorRecommendation();
      });
    });
  });

  if (simServices) {
    simServices.querySelectorAll('.sim-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        if (simServices.querySelectorAll('.sim-chip.active').length === 0) {
          chip.classList.add('active');
        }
        updateSimulatorRecommendation();
      });
    });
  }

  if (simSendWhatsapp) {
    simSendWhatsapp.addEventListener('click', () => {
      const profile = simProfile?.querySelector('.sim-chip.active')?.getAttribute('data-val') || '';
      const activeServices = Array.from(simServices?.querySelectorAll('.sim-chip.active') || []).map((el) =>
        el.getAttribute('data-val')
      );
      const scale = simScale?.querySelector('.sim-chip.active')?.getAttribute('data-val') || '';

      const text = [
        'Olá, equipe *Pilter Tecnologia*! Configurei uma solução no site e gostaria de uma proposta:',
        '',
        `*Ambiente:* ${profile}`,
        `*Serviços:* ${activeServices.join(', ')}`,
        `*Porte Estimado:* ${scale}`,
        '',
        'Podem me enviar uma análise de viabilidade?'
      ].join('\n');

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  // 8. Brazilian Phone Input Mask
  const phoneInput = document.getElementById('telefone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 6) {
        if (digits.length === 11) {
          e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        } else {
          e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        }
      } else if (digits.length > 2) {
        e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else if (digits.length > 0) {
        e.target.value = `(${digits}`;
      }
    });
  }

  // 9. WhatsApp Contact Form Submission
  const whatsappForm = document.getElementById('whatsappForm');
  if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome')?.value.trim() || '';
      const empresa = document.getElementById('empresa')?.value.trim() || '';
      const telefone = document.getElementById('telefone')?.value.trim() || '';
      const localidade = document.getElementById('localidade')?.value.trim() || '';
      const servico = document.getElementById('servico')?.value || '';
      const mensagem = document.getElementById('mensagem')?.value.trim() || '';

      const lines = [
        'Olá, *Pilter Tecnologia*! Solicito atendimento através do formulário do site:',
        '',
        `*Nome:* ${nome}`,
        `*Empresa/Shopping:* ${empresa}`,
        `*WhatsApp/Telefone:* ${telefone}`,
        `*Localidade:* ${localidade}`,
        `*Serviço Desejado:* ${servico}`
      ];

      if (mensagem) {
        lines.push(`*Detalhes:* ${mensagem}`);
      }

      const fullMessage = lines.join('\n');
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;

      window.open(whatsappUrl, '_blank', 'noopener');
    });
  }

  // 10. Asaas 2ª Via de Fatura Portal Lookup
  initAsaasInvoicePortal();
});

function formatCurrencyBRL(value) {
  const num = Number(value || 0);
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateBR(isoDate) {
  if (!isoDate) return '-';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initAsaasInvoicePortal() {
  const form = document.getElementById('invoiceSearchForm');
  const input = document.getElementById('invoiceQuery');
  const clearBtn = document.getElementById('invoiceClearBtn');
  const submitBtn = document.getElementById('invoiceSubmitBtn');
  const resultsArea = document.getElementById('invoiceResultsArea');

  if (!form || !input || !resultsArea) return;

  input.addEventListener('input', () => {
    const val = input.value.trim();
    if (clearBtn) {
      clearBtn.hidden = val.length === 0;
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.hidden = true;
      resultsArea.hidden = true;
      resultsArea.innerHTML = '';
      input.focus();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rawQuery = input.value.trim();
    if (rawQuery.length < 3) return;

    resultsArea.hidden = false;
    resultsArea.innerHTML = `
      <div class="invoice-loading">
        <p class="mono-text">CONSULTANDO FATURAS NO ASAAS...</p>
        <p style="color: var(--ink-secondary); font-size: 0.9rem; margin-top: 6px;">Aguarde um instante enquanto localizamos seu cadastro.</p>
      </div>
    `;

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      const response = await fetch(`/api/faturas?q=${encodeURIComponent(rawQuery)}`);
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Não foi possível consultar as faturas no momento.');
      }

      if (!data.customers || data.customers.length === 0) {
        resultsArea.innerHTML = `
          <div class="invoice-empty">
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 6px;">Nenhum cliente encontrado para "${escapeHtml(rawQuery)}"</h4>
            <p style="color: var(--ink-secondary); font-size: 0.92rem; margin-bottom: 16px;">
              Verifique se digitou corretamente o CPF, CNPJ ou Nome cadastrado, ou solicite sua 2ª via pelo nosso WhatsApp Financeiro.
            </p>
            <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá, Pilter Tecnologia! Gostaria de solicitar a 2ª via da minha fatura. Meus dados: ' + rawQuery)}"
               target="_blank" rel="noopener" class="btn btn-outline btn-sm">
              <span>Solicitar 2ª Via pelo WhatsApp</span>
            </a>
          </div>
        `;
        return;
      }

      if (!data.invoices || data.invoices.length === 0) {
        const custNames = data.customers.map((c) => escapeHtml(c.name)).join(', ');
        resultsArea.innerHTML = `
          <div class="invoice-empty">
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 6px;">Tudo em dia para ${custNames}!</h4>
            <p style="color: var(--ink-secondary); font-size: 0.92rem;">
              Não encontramos nenhuma fatura pendente ou vencida em aberto para este cadastro no momento.
            </p>
          </div>
        `;
        return;
      }

      const itemsHtml = data.invoices
        .map((inv) => {
          const isOverdue = inv.status === 'OVERDUE';
          const statusLabel = isOverdue ? 'VENCIDA' : 'EM ABERTO';
          const statusClass = isOverdue ? 'status-overdue' : 'status-pending';
          const primaryLink = inv.invoiceUrl || inv.bankSlipUrl || '#';

          return `
            <div class="invoice-item">
              <div class="invoice-main-info">
                <div class="invoice-top-row">
                  <span class="invoice-status-badge ${statusClass}">${statusLabel}</span>
                  <span class="mono-text text-muted">${escapeHtml(inv.customerName)} ${inv.customerDoc ? '• ' + escapeHtml(inv.customerDoc) : ''}</span>
                </div>
                <div class="invoice-desc">${escapeHtml(inv.description)}</div>
                <div class="invoice-submeta">
                  Fatura Nº ${escapeHtml(inv.invoiceNumber || inv.id)} • Forma: ${escapeHtml(inv.billingType || 'Boleto / Pix')}
                </div>
              </div>

              <div class="invoice-price-block">
                <span class="invoice-amount">${formatCurrencyBRL(inv.value)}</span>
                <span class="invoice-due">Vencimento: <strong>${formatDateBR(inv.dueDate)}</strong></span>
              </div>

              <div class="invoice-actions">
                ${
                  inv.bankSlipUrl
                    ? `<a href="${escapeHtml(inv.bankSlipUrl)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                        <span>Baixar Boleto PDF</span>
                      </a>`
                    : ''
                }
                <a href="${escapeHtml(primaryLink)}" target="_blank" rel="noopener" class="btn btn-dark btn-sm">
                  <span>Abrir Fatura / Pix</span>
                </a>
              </div>
            </div>
          `;
        })
        .join('');

      resultsArea.innerHTML = `
        <div class="invoice-customer-banner">
          <span style="font-size: 0.9rem; font-weight: 600;">
            Encontramos <strong>${data.invoices.length}</strong> fatura(s) em aberto:
          </span>
          <span class="mono-text text-muted">CLIQUE EM "ABRIR FATURA / PIX" PARA PAGAR</span>
        </div>
        <div class="invoice-list">${itemsHtml}</div>
      `;
    } catch (err) {
      resultsArea.innerHTML = `
        <div class="invoice-error-box">
          <strong style="display: block; margin-bottom: 6px;">Aviso na consulta automática</strong>
          <p style="font-size: 0.9rem; margin-bottom: 14px;">${escapeHtml(err.message)}</p>
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá, Pilter Tecnologia! Preciso retirar a 2ª via de fatura para: ' + rawQuery)}"
             target="_blank" rel="noopener" class="btn btn-dark btn-sm">
            <span>Retirar 2ª Via pelo WhatsApp</span>
          </a>
        </div>
      `;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  });
}

/**
 * LGPD Compliance Engine:
 * - Cookie Consent Banner (Accept All / Essential Only / Reopen Preferences)
 * - Legal Modals (Política de Privacidade, Termos de Uso, Direitos do Titular Art. 18)
 * - Data Subject Request (DSAR) submission to DPO channel
 */
function initLgpdCompliance() {
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAcceptBtn');
  const essentialBtn = document.getElementById('cookieEssentialBtn');
  const reopenBtn = document.getElementById('reopenCookiesBtn');

  const CONSENT_KEY = 'pilter_lgpd_consent_v1';

  if (cookieBanner && !localStorage.getItem(CONSENT_KEY)) {
    cookieBanner.hidden = false;
  }

  function saveConsent(level) {
    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({
        level,
        company: 'Pilter Tecnologia LTDA',
        cnpj: '11.040.665/0001-45',
        timestamp: new Date().toISOString()
      })
    );
    if (cookieBanner) {
      cookieBanner.hidden = true;
    }
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => saveConsent('accepted_all'));
  }

  if (essentialBtn) {
    essentialBtn.addEventListener('click', () => saveConsent('essential_only'));
  }

  if (reopenBtn && cookieBanner) {
    reopenBtn.addEventListener('click', () => {
      cookieBanner.hidden = false;
    });
  }

  // Open Modals
  document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.hidden = false;
      }
    });
  });

  // Close Modals
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const backdrop = btn.closest('.lgpd-modal-backdrop');
      if (backdrop) {
        backdrop.hidden = true;
      }
    });
  });

  document.querySelectorAll('.lgpd-modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.hidden = true;
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lgpd-modal-backdrop').forEach((b) => {
        b.hidden = true;
      });
    }
  });

  // LGPD Art. 18 Data Subject Request Form
  const lgpdRequestForm = document.getElementById('lgpdRequestForm');
  if (lgpdRequestForm) {
    lgpdRequestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('lgpdNome')?.value.trim() || '';
      const doc = document.getElementById('lgpdDoc')?.value.trim() || '';
      const tipo = document.getElementById('lgpdTipo')?.value || '';

      const msg = [
        'Olá, Encarregado de Dados (DPO) da *Pilter Tecnologia LTDA (CNPJ 11.040.665/0001-45)*!',
        'Gostaria de registrar uma solicitação formal nos termos do Art. 18 da LGPD:',
        '',
        `*Titular:* ${nome}`,
        `*CPF/CNPJ:* ${doc}`,
        `*Requerimento:* ${tipo}`
      ].join('\n');

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }
}
