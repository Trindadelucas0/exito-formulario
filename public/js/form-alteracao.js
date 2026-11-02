// Campos obrigatórios de cada bloco condicional (exceto observações da baixa, que é opcional)
const camposObrigatoriosPorBloco = {
    'bloco-dados-cadastrais': ['novo_nome_fantasia', 'nova_razao_social', 'novo_endereco', 'novo_tipo_sociedade'],
    'bloco-quadro-societario': [],
    'bloco-retirada-atividades': ['cnaes_retirar'],
    'bloco-novas-atividades': ['cnaes_incluir'],
    'bloco-abertura-filial': ['dados_filial'],
    'bloco-baixa-empresa': [],
    'bloco-outras-alteracoes': ['descricao_alteracao']
};

function criarFormularioNovoSocio(numero) {
    return `
        <fieldset id="novo-socio-${numero}" class="novo-socio-formulario">
            <legend>👤 Dados do Novo Sócio ${numero}</legend>

            <label for="novo_socio_nome_${numero}">Nome:</label>
            <input type="text" id="novo_socio_nome_${numero}" name="novo_socio_nome_${numero}" placeholder="Digite o nome completo do sócio" required>

            <label for="novo_socio_cpf_${numero}">CPF:</label>
            <input type="text" id="novo_socio_cpf_${numero}" name="novo_socio_cpf_${numero}" placeholder="Ex.: 000.000.000-00" required>

            <label for="novo_socio_rg_${numero}">RG:</label>
            <input type="text" id="novo_socio_rg_${numero}" name="novo_socio_rg_${numero}" placeholder="Digite o número do RG" required>

            <label for="novo_socio_data_expedicao_${numero}">Data de Expedição:</label>
            <input type="date" id="novo_socio_data_expedicao_${numero}" name="novo_socio_data_expedicao_${numero}" required>

            <label for="novo_socio_orgao_expedidor_${numero}">Órgão Expedidor:</label>
            <input type="text" id="novo_socio_orgao_expedidor_${numero}" name="novo_socio_orgao_expedidor_${numero}" placeholder="Ex.: SSP, IFP, DETRAN" required>

            <label for="novo_socio_estado_civil_${numero}">Estado Civil:</label>
            <select id="novo_socio_estado_civil_${numero}" name="novo_socio_estado_civil_${numero}" required>
                <option value="">Selecione...</option>
                <option>Solteiro(a)</option>
                <option>Casado(a)</option>
                <option>Divorciado(a)</option>
                <option>Viúvo(a)</option>
            </select>

            <label for="novo_socio_regime_casamento_${numero}">Regime de Casamento:</label>
            <select id="novo_socio_regime_casamento_${numero}" name="novo_socio_regime_casamento_${numero}">
                <option value="">Selecione...</option>
                <option>Comunhão Parcial de Bens</option>
                <option>Comunhão Universal de Bens</option>
                <option>Separação Total de Bens</option>
            </select>

            <label for="novo_socio_profissao_${numero}">Profissão:</label>
            <input type="text" id="novo_socio_profissao_${numero}" name="novo_socio_profissao_${numero}" placeholder="Digite a profissão" required>

            <label for="novo_socio_naturalidade_${numero}">Naturalidade:</label>
            <input type="text" id="novo_socio_naturalidade_${numero}" name="novo_socio_naturalidade_${numero}" placeholder="Cidade e estado de nascimento" required>

            <label for="novo_socio_data_nascimento_${numero}">Data de Nascimento:</label>
            <input type="date" id="novo_socio_data_nascimento_${numero}" name="novo_socio_data_nascimento_${numero}" required>

            <label for="novo_socio_filiacao_${numero}">Filiação:</label>
            <input type="text" id="novo_socio_filiacao_${numero}" name="novo_socio_filiacao_${numero}" placeholder="Nome da mãe e do pai" required>

            <label for="novo_socio_endereco_${numero}">Endereço:</label>
            <input type="text" id="novo_socio_endereco_${numero}" name="novo_socio_endereco_${numero}" placeholder="Rua, número e complemento" required>

            <label for="novo_socio_cep_${numero}">CEP:</label>
            <input type="text" id="novo_socio_cep_${numero}" name="novo_socio_cep_${numero}" placeholder="Ex.: 70000-000" required>

            <label for="novo_socio_email_${numero}">E-mail:</label>
            <input type="email" id="novo_socio_email_${numero}" name="novo_socio_email_${numero}" placeholder="Ex.: socio@email.com" required>

            <label for="novo_socio_telefone_${numero}">Telefone:</label>
            <input type="tel" id="novo_socio_telefone_${numero}" name="novo_socio_telefone_${numero}" placeholder="Ex.: (61) 99999-9999" required>

            <span class="grupo-label">Sócio Administrador:</span>
            <div class="radio-group" role="group" aria-label="Sócio ${numero} é administrador">
                <div class="radio-item">
                    <input type="radio" id="novo_socio_administrador_sim_${numero}" name="novo_socio_administrador_${numero}" value="sim">
                    <label for="novo_socio_administrador_sim_${numero}">Sim</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="novo_socio_administrador_nao_${numero}" name="novo_socio_administrador_${numero}" value="nao">
                    <label for="novo_socio_administrador_nao_${numero}">Não</label>
                </div>
            </div>

            <label for="novo_socio_participacao_${numero}">Valor da Participação no Capital Social (%):</label>
            <input type="text" id="novo_socio_participacao_${numero}" name="novo_socio_participacao_${numero}" placeholder="Ex.: 50%" required>

            <p class="observacao-documentos"><strong>Obs.:</strong> Enviar foto do RG ou CNH e CPF.</p>
        </fieldset>
    `;
}

function atualizarFormulariosNovosSocios() {
    const quantidade = Number(document.getElementById('quantidade_novos_socios')?.value || 0);
    const container = document.getElementById('novos-socios-container');
    if (!container) return;

    const quantidadeAtual = container.querySelectorAll('.novo-socio-formulario').length;
    for (let numero = quantidadeAtual + 1; numero <= quantidade; numero += 1) {
        container.insertAdjacentHTML('beforeend', criarFormularioNovoSocio(numero));
    }

    for (let numero = quantidadeAtual; numero > quantidade; numero -= 1) {
        container.querySelector(`#novo-socio-${numero}`)?.remove();
    }
}

function limparCamposDoBloco(bloco) {
    bloco.querySelectorAll('input, textarea, select').forEach(campo => {
        if (campo.type === 'radio' || campo.type === 'checkbox') {
            campo.checked = false;
        } else {
            campo.value = '';
        }
        campo.required = false;
    });

    const quantidadeNovosSocios = bloco.querySelector('#quantidade_novos_socios');
    if (quantidadeNovosSocios) quantidadeNovosSocios.value = '0';

    const containerNovosSocios = bloco.querySelector('#novos-socios-container');
    if (containerNovosSocios) containerNovosSocios.innerHTML = '';
}

function alternarBlocoCondicional(checkbox) {
    const blocoId = checkbox.dataset.bloco;
    const bloco = document.getElementById(blocoId);
    if (!bloco) return;

    const camposObrigatorios = camposObrigatoriosPorBloco[blocoId] || [];

    if (checkbox.checked) {
        bloco.style.display = 'block';
        camposObrigatorios.forEach(nomeCampo => {
            const campo = bloco.querySelector(`[name="${nomeCampo}"]`);
            if (campo) campo.required = true;
        });
    } else {
        bloco.style.display = 'none';
        limparCamposDoBloco(bloco);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-briefing');
    if (form && !form.querySelector('.logo-vision-ads')) {
        const img = document.createElement('img');
        img.src = '/img/vision 3.png';
        img.alt = 'Logo Vision Ads';
        img.className = 'logo-vision-ads';
        form.prepend(img);
    }

    document.querySelectorAll('input[name="tipo_alteracao"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            alternarBlocoCondicional(this);
        });
    });

    const quantidadeNovosSocios = document.getElementById('quantidade_novos_socios');
    if (quantidadeNovosSocios) {
        quantidadeNovosSocios.addEventListener('change', atualizarFormulariosNovosSocios);
    }
});

document.getElementById('form-briefing').addEventListener('submit', function (e) {
    e.preventDefault();

    const tiposMarcados = Array.from(document.querySelectorAll('input[name="tipo_alteracao"]:checked'));
    if (tiposMarcados.length === 0) {
        alert('⚠️ Selecione ao menos um tipo de alteração contratual.');
        return;
    }

    const formData = new FormData(this);
    const quadroSocietarioMarcado = tiposMarcados.some(checkbox => checkbox.value === 'quadro_societario');
    const quantidadeNovosSocios = Number(formData.get('quantidade_novos_socios') || 0);

    if (quadroSocietarioMarcado) {
        const possuiSaida = Boolean(formData.get('socio_a_retirar')?.trim());
        const possuiTransferencia = Boolean(formData.get('transferencia_cotas')?.trim());
        if (!possuiSaida && !possuiTransferencia && quantidadeNovosSocios === 0) {
            alert('⚠️ Informe ao menos uma saída, entrada de novo sócio ou transferência de cotas.');
            document.getElementById('socio_a_retirar')?.focus();
            return;
        }
    }

    const btn = document.getElementById('btn-enviar');
    const btnSpan = btn.querySelector('span');
    btn.disabled = true;
    btnSpan.innerText = 'ENVIANDO DADOS...';

    const novosSocios = [];
    for (let numero = 1; numero <= quantidadeNovosSocios; numero += 1) {
        novosSocios.push({
            numero,
            nome: formData.get(`novo_socio_nome_${numero}`),
            cpf: formData.get(`novo_socio_cpf_${numero}`),
            rg: formData.get(`novo_socio_rg_${numero}`),
            data_expedicao: formData.get(`novo_socio_data_expedicao_${numero}`),
            orgao_expedidor: formData.get(`novo_socio_orgao_expedidor_${numero}`),
            estado_civil: formData.get(`novo_socio_estado_civil_${numero}`),
            regime_casamento: formData.get(`novo_socio_regime_casamento_${numero}`),
            profissao: formData.get(`novo_socio_profissao_${numero}`),
            naturalidade: formData.get(`novo_socio_naturalidade_${numero}`),
            data_nascimento: formData.get(`novo_socio_data_nascimento_${numero}`),
            filiacao: formData.get(`novo_socio_filiacao_${numero}`),
            endereco_socio: formData.get(`novo_socio_endereco_${numero}`),
            cep_socio: formData.get(`novo_socio_cep_${numero}`),
            email_socio: formData.get(`novo_socio_email_${numero}`),
            telefone_socio: formData.get(`novo_socio_telefone_${numero}`),
            administrador: formData.get(`novo_socio_administrador_${numero}`),
            participacao: formData.get(`novo_socio_participacao_${numero}`)
        });
    }

    const payload = {
        razao_social_atual: formData.get('razao_social_atual'),
        cnpj_empresa: formData.get('cnpj_empresa'),
        telefone_contato: formData.get('telefone_contato'),
        email_contato: formData.get('email_contato'),
        tipos_alteracao: tiposMarcados.map(cb => cb.value),
        novo_nome_fantasia: formData.get('novo_nome_fantasia'),
        nova_razao_social: formData.get('nova_razao_social'),
        novo_endereco: formData.get('novo_endereco'),
        novo_tipo_sociedade: formData.get('novo_tipo_sociedade'),
        socio_a_retirar: formData.get('socio_a_retirar'),
        quantidade_novos_socios: quantidadeNovosSocios,
        novos_socios: novosSocios,
        transferencia_cotas: formData.get('transferencia_cotas'),
        cnaes_retirar: formData.get('cnaes_retirar'),
        cnaes_incluir: formData.get('cnaes_incluir'),
        dados_filial: formData.get('dados_filial'),
        obs_baixa: formData.get('obs_baixa'),
        descricao_alteracao: formData.get('descricao_alteracao')
    };

    fetch('/api/alteracao-contratual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(async response => {
            const data = await response.json();
            if (!response.ok || !data.ok) throw new Error(data.message || 'Falha ao enviar');
            return data;
        })
        .then(data => {
            window.location.href = data.redirect;
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('❌ Ocorreu um erro ao enviar. Tente novamente.');
            btn.disabled = false;
            btnSpan.innerText = '✨ Enviar Solicitação';
        });
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { criarFormularioNovoSocio, atualizarFormulariosNovosSocios };
}
