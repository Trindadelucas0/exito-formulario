function criarFormularioSocio(numero) {
    return `
        <fieldset id="socio-${numero}">
            <legend>👤 Dados do Sócio ${numero}</legend>

            <label for="socio_nome_${numero}">Nome:</label>
            <input type="text" id="socio_nome_${numero}" name="socio_nome_${numero}" placeholder="Digite o nome completo do sócio" required>

            <label for="socio_cpf_${numero}">CPF:</label>
            <input type="text" id="socio_cpf_${numero}" name="socio_cpf_${numero}" placeholder="Ex.: 000.000.000-00" required>

            <label for="socio_rg_${numero}">RG:</label>
            <input type="text" id="socio_rg_${numero}" name="socio_rg_${numero}" placeholder="Digite o número do RG" required>

            <label for="socio_data_expedicao_${numero}">Data de Expedição:</label>
            <input type="date" id="socio_data_expedicao_${numero}" name="socio_data_expedicao_${numero}" required>

            <label for="socio_orgao_expedidor_${numero}">Órgão Expedidor:</label>
            <input type="text" id="socio_orgao_expedidor_${numero}" name="socio_orgao_expedidor_${numero}" placeholder="Ex: SSP, IFP, DETRAN" required>

            <label>Estado Civil:</label>
            <select name="estado_civil_${numero}" required>
                <option value="">Selecione...</option>
                <option>Solteiro(a)</option>
                <option>Casado(a)</option>
                <option>Divorciado(a)</option>
                <option>Viúvo(a)</option>
            </select>

            <label>Regime de Casamento:</label>
            <select name="regime_casamento_${numero}">
                <option value="">Selecione...</option>
                <option>Comunhão Parcial de Bens</option>
                <option>Comunhão Universal de Bens</option>
                <option>Separação Total de Bens</option>
            </select>

            <label for="profissao_${numero}">Profissão:</label>
            <input type="text" id="profissao_${numero}" name="profissao_${numero}" placeholder="Digite a profissão" required>

            <label for="naturalidade_${numero}">Naturalidade:</label>
            <input type="text" id="naturalidade_${numero}" name="naturalidade_${numero}" placeholder="Cidade e estado de nascimento" required>

            <label for="data_nascimento_${numero}">Data de Nascimento:</label>
            <input type="date" id="data_nascimento_${numero}" name="data_nascimento_${numero}" required>

            <label for="filiacao_${numero}">Filiação:</label>
            <input type="text" id="filiacao_${numero}" name="filiacao_${numero}" placeholder="Nome da mãe e do pai" required>

            <label for="endereco_socio_${numero}">Endereço:</label>
            <input type="text" id="endereco_socio_${numero}" name="endereco_socio_${numero}" placeholder="Rua, número e complemento" required>

            <label for="cep_socio_${numero}">CEP:</label>
            <input type="text" id="cep_socio_${numero}" name="cep_socio_${numero}" placeholder="Ex.: 70000-000" required>

            <label for="email_socio_${numero}">E-mail:</label>
            <input type="email" id="email_socio_${numero}" name="email_socio_${numero}" placeholder="Ex.: socio@email.com" required>

            <label for="telefone_socio_${numero}">Telefone:</label>
            <input type="tel" id="telefone_socio_${numero}" name="telefone_socio_${numero}" placeholder="Ex.: (61) 99999-9999" required>

            <label>Sócio Administrador:</label>
            <div class="radio-group">
                <div class="radio-item"><input type="radio" name="administrador_${numero}" value="sim"> Sim</div>
                <div class="radio-item"><input type="radio" name="administrador_${numero}" value="nao"> Não</div>
            </div>

            <label for="participacao_${numero}">Valor da Participação no Capital Social (%):</label>
            <input type="text" id="participacao_${numero}" name="participacao_${numero}" placeholder="Ex.: 50%" required>

            <p style="margin-top: 20px; color: var(--text-secondary); font-size: 0.9em;"><strong>Obs:</strong> Enviar foto do RG ou CNH e CPF.</p>
        </fieldset>
    `;
}

function atualizarFormulariosSocios() {
    const quantidadeSocios = document.getElementById('quantidade_socios').value;
    const container = document.getElementById('socios-container');

    container.innerHTML = '';

    if (quantidadeSocios && quantidadeSocios > 0) {
        for (let i = 1; i <= quantidadeSocios; i++) {
            container.insertAdjacentHTML('beforeend', criarFormularioSocio(i));
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const selectQuantidade = document.getElementById('quantidade_socios');
    if (selectQuantidade) {
        selectQuantidade.addEventListener('change', atualizarFormulariosSocios);
    }

    const form = document.getElementById('form-briefing');
    if (form && !form.querySelector('.logo-vision-ads')) {
        const img = document.createElement('img');
        img.src = '/img/vision 3.png';
        img.alt = 'Logo Vision Ads';
        img.className = 'logo-vision-ads';
        form.prepend(img);
    }

    document.querySelectorAll('.dia-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const horarioInicio = this.closest('.horario-dia').querySelector('.horario-inicio');
            const horarioFim = this.closest('.horario-dia').querySelector('.horario-fim');

            if (this.checked) {
                horarioInicio.disabled = false;
                horarioFim.disabled = false;
            } else {
                horarioInicio.disabled = true;
                horarioFim.disabled = true;
                horarioInicio.value = '';
                horarioFim.value = '';
            }
        });
    });
});

document.getElementById('form-briefing').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = document.getElementById('btn-enviar');
    const btnSpan = btn.querySelector('span');
    btn.disabled = true;
    btnSpan.innerText = 'ENVIANDO DADOS...';

    const formData = new FormData(this);

    const dias_semana = formData.getAll('dias_semana');
    const diasMap = {
        Segunda: 'segunda',
        Terça: 'terca',
        Quarta: 'quarta',
        Quinta: 'quinta',
        Sexta: 'sexta',
        Sábado: 'sabado',
        Domingo: 'domingo'
    };

    const horarios = {};
    dias_semana.forEach(dia => {
        const diaKey = diasMap[dia];
        if (diaKey) {
            horarios[dia] = {
                inicio: formData.get(`horario_inicio_${diaKey}`) || '',
                fim: formData.get(`horario_fim_${diaKey}`) || ''
            };
        }
    });

    const quantidade_socios = formData.get('quantidade_socios');
    const socios = [];
    if (quantidade_socios) {
        for (let i = 1; i <= quantidade_socios; i++) {
            const socio = {
                numero: i,
                nome: formData.get(`socio_nome_${i}`),
                cpf: formData.get(`socio_cpf_${i}`),
                rg: formData.get(`socio_rg_${i}`),
                data_expedicao: formData.get(`socio_data_expedicao_${i}`),
                orgao_expedidor: formData.get(`socio_orgao_expedidor_${i}`),
                estado_civil: formData.get(`estado_civil_${i}`),
                regime_casamento: formData.get(`regime_casamento_${i}`),
                profissao: formData.get(`profissao_${i}`),
                naturalidade: formData.get(`naturalidade_${i}`),
                data_nascimento: formData.get(`data_nascimento_${i}`),
                filiacao: formData.get(`filiacao_${i}`),
                endereco_socio: formData.get(`endereco_socio_${i}`),
                cep_socio: formData.get(`cep_socio_${i}`),
                email_socio: formData.get(`email_socio_${i}`),
                telefone_socio: formData.get(`telefone_socio_${i}`),
                administrador: formData.get(`administrador_${i}`),
                participacao: formData.get(`participacao_${i}`)
            };
            if (socio.nome) socios.push(socio);
        }
    }

    const payload = {
        razao_social: formData.get('razao_social'),
        nome_fantasia: formData.get('nome_fantasia'),
        endereco: formData.get('endereco'),
        bairro: formData.get('bairro'),
        iptu: formData.get('iptu'),
        cep: formData.get('cep'),
        metragem: formData.get('metragem'),
        dias_semana,
        horarios,
        telefone_empresa: formData.get('telefone_empresa'),
        email_empresa: formData.get('email_empresa'),
        capital_social: formData.get('capital_social'),
        objeto_social: formData.get('objeto_social'),
        cnae_primario: formData.get('cnae_primario'),
        cnae_secundario: formData.get('cnae_secundario'),
        sociedade: formData.get('sociedade'),
        nome_socio_receita: formData.get('nome_socio_receita'),
        quantidade_socios,
        regime: formData.get('regime'),
        socios
    };

    fetch('/api/constituicao', {
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
            btnSpan.innerText = '✨ Enviar Ficha';
        });
});
