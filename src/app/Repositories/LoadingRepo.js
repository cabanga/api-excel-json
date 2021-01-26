const xlsx = require('xlsx')
const fs = require('fs')
const filePath = './Files/invoices/loading'
const pathProcessed = './Files/invoices/processed'
const AXIOS = require('axios');

const baseUrl = 'http://localhost:3333'


//=========================================================================================
export async function loadInvoice () {
    //let process_invoices = await checkExistFile()
    
    await authUser()
    .then(response => { 
        let data = response.data
        let status = response.status

        console.log(status)

        if (status === 200) {
            createLogs('user authenticated successfully')
            checkExistFile()            
        }
    })
    return "Esta studo OK"
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
    let filePath = `${pathProcessed}/factura-id-${file_name}.json`

    try {
        let data = JSON.stringify(items)
        fs.writeFileSync(filePath, data)
        createLogs(`file successfully processed, and create JSON file, name : ${filePath}`)
    } catch (error) {
        createLogs(`Failed to process, JSON file, name : ${filePath}`)
        console.log(error)
    }
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

