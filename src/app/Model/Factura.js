module.exports = {
    cliente: null,
    contas_cliente: {},
    data_origem_factura: null,
    data_vencimento: "2021-01-27",
    documento: "Factura",
    leitura: "",
    moeda: null,
    numero_origem_factura: null,
    observacao: "",
    pagamento: {
        adiantamento: [],
        bancos: [],
        data_pagamento: null,
        forma: null,
        forma_pagamento_id: null,
        is_adiantamento: 1,
        linha_pagamentos: [],
        referencia: null,
        total_pago: 0,
        total_valor_recebido: 0,
        troco: 0,
        valor_recebido: 0
    },
    produtos: [],
    serie_id: null,
    total: 0,
    totalComImposto: 0,
    totalSemImposto: 0
}