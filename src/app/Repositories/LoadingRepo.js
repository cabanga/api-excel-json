const xlsx = require('xlsx')
const fs = require('fs')
const filePath = './Files/invoices/loading'
const pathProcessed = './Files/invoices/processed'


//=========================================================================================
export async function loadInvoice () {
    let process_invoices = await checkExistFile()
    return process_invoices
}


//=========================================================================================
function checkExistFile(){
    fs.readdir(filePath, function (err, files) {
        if (files.length) {
            let current_file = files[0]
            readFile(current_file)
        }else{
            console.log("NENHUM FICHEIRO ENCONTRADO")
        }
    })
}

//=========================================================================================
function readFile(file){
    var workbook = xlsx.readFile(`${filePath}/${file}`)
    var first_ws = workbook.Sheets['FACT_EDIT']
    var data = xlsx.utils.sheet_to_json(first_ws)

    
    if (data.length) {
        var groupByCliente = groupBy(data, 'cliente_id')
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
    let items = group[1]
    let filePath = `${pathProcessed}/cliente-id-${file_name}.json`

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
/*
function moveFile(file) {
    fs.copyFileSync(`${filePath}/${file}`, `${pathSuccess}/${file}`)
    fs.renameSync(`${pathSuccess}/${file}`, `${pathSuccess}/invoice-${Date.now()}.xlsx`)
    
    fs.unlinkSync(`${filePath}/${file}`)
    createLogs('File moved to the success folder')
}
*/






















//=========================================================================================
function createLogs(data){
    let filePath = './Files/logs.txt'
    fs.appendFile(filePath, `${data}\n`, () => {})
}

