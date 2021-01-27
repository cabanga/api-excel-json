const xlsx = require('xlsx')
const fs = require('fs')
const filePath = './Files/invoices/loading'
const pathProcessed = './Files/invoices/processed'
const AXIOS = require('axios')
var moment = require("moment")

const baseUrl = 'http://epasn-qas.unig-erp.com:3355'
var Factura = require('../Model/Factura')


//=========================================================================================
export async function loadInvoice () {
    
    
    await authUser()
    .then(response => { 
        let data = response.data
        let status = response.status

        console.log(status)

        if (status === 200) {
            createLogs('user authenticated successfully')
            //checkExistFile()
            readJsonFile()
        }
    })
    
}


//=========================================================================================
async function checkExistFile(){
    createLogs('checking if there is any file in the folder')

    fs.readdir(filePath, function (err, files) {
        if (files.length) {
            let current_file = files[0]
            readFile(current_file)
        }else{
            createLogs('No file founds')
            console.log("NENHUM FICHEIRO ENCONTRADO")
        }
    })
}

//=========================================================================================
function readFile(file){
    var workbook = xlsx.readFile(`${filePath}/${file}`)
    var first_ws = workbook.Sheets['FACT_EDIT']
    var data = xlsx.utils.sheet_to_json(first_ws)

    createLogs(`reading the invoice file, with reference FACT_EDIT`)
    
    if (data.length) {
        var groupByCliente = groupBy(data, 'factura')
        var invoices = Object.entries(groupByCliente) 
        
        for (var i = 0; i < invoices.length; i++) {
            let invoice = invoices[i]
            createJsonFile(invoice)
        }
    }
}

//=========================================================================================
function createJsonFile(group) {
    let file_name = group[0]
    createLogs(`reading the invoice with reference - ${file_name}`)

    let items = group[1]
    let filePath = `${pathProcessed}/process-id-${file_name}.json`

    try {
        let data = JSON.stringify(items)
        fs.writeFileSync(filePath, data)
        createLogs(`file successfully processed, and create JSON file, name: ${filePath}`)
    } catch (error) {
        createLogs(`Failed to process, JSON file, name : ${filePath}`)
        console.log(error)
    }
}

//=========================================================================================
async function readJsonFile(){
    createLogs('read the JSON files to create invoices')

    fs.readdir(pathProcessed, function (err, files) {
        if (files.length) {
            for (var i = 0; i < files.length; i++) {
                let json_file = files[i]
                let filePath = `${pathProcessed}/${json_file}`
                getinfoJsonFile(filePath)
            }            
        }else{
            createLogs('No file founds')
            console.log("NENHUM FICHEIRO ENCONTRADO")
        }
    })
}

//=========================================================================================
async function getinfoJsonFile(file){
    let content = fs.readFileSync(file)
    let lines_services = JSON.parse(content)
    let nova_factura = Factura


    //===================== INFORMAÇÕES COMPLEMENTARES ===================================
    let first_line = lines_services[0]
    
    for(let line of lines_services){
        let artigo = {
            desconto: 0,
            imposto_id: 2,
            linhaTotalSemImposto: Number(line.total) * Number(line.quantidade_ou_onsumo),
            nome: line.ARTIGO,
            observacao: null,
            produto_id: line.artigo_id,
            quantidade: Number(line.quantidade_ou_onsumo),
            total: Number(line.total) * Number(line.quantidade_ou_onsumo),
            valor: Number(line.total),
            valorImposto: 0,
            valor_original: Number(line.total)
        }
        nova_factura.produtos.push(artigo)
    }

    nova_factura.serie_id = first_line.artigo_id
    nova_factura.cliente = first_line.cliente_id
    nova_factura.data_vencimento = first_line.data_vencimento //moment(first_line.data_vencimento).format("YYYY/MM//DD")
    nova_factura.numero_origem_factura = first_line.factura
    nova_factura.total = nova_factura.produtos.reduce((producto, item) => producto + item.total, 0)

    console.log(nova_factura)

}

//=========================================================================================
function groupBy(items, key) {
    return items.reduce(function(groups, item) {
        const val = item[key]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
    }, {})
}


//=========================================================================================
async function authUser() {
    let user = { username: 'unig', password: 'WTUnig#2020'}

    return AXIOS.post(`${baseUrl}/user/authenticate`, user)
    .then( (response) => {
        return response
    })
    .catch(function (error) {
        console.log(error)
    })
}

//=========================================================================================
/*
function moveFile(file) {
    fs.copyFileSync(`${filePath}/${file}`, `${pathSuccess}/${file}`)
    fs.renameSync(`${pathSuccess}/${file}`, `${pathSuccess}/invoice-${Date.now()}.xlsx`)
    
    fs.unlinkSync(`${filePath}/${file}`)
    createLogs('File moved to the success folder')
}
*/






















//=========================================================================================
async function createLogs(data){
    let filePath = './Files/logs.txt'
    fs.appendFile(filePath, `${data}\n`, () => {})
}

