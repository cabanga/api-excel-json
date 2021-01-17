const xlsx = require('xlsx')
const fs = require('fs')
const filePath = './Files/invoices/loading'
const pathSuccess = './Files/invoices/success/'
const pathFailed = './Files/invoices/failed/'


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
    var workbook = xlsx.readFile(`${filePath}/${file}`, {celldates: true})
    var first_ws = workbook.Sheets['Municipios']
    var data = xlsx.utils.sheet_to_json(first_ws)

    if (data.length) {
        moveFile(file)
    }
}

//=========================================================================================
function moveFile(file) {
    fs.copyFileSync(`${filePath}/${file}`, `${pathSuccess}/${file}`)
    fs.renameSync(`${pathSuccess}/${file}`, `${pathSuccess}/invoice-${Date.now()}.xlsx`)
    
    fs.unlinkSync(`${filePath}/${file}`)
    createLogs('File moved to the success folder')
}























//=========================================================================================
function createLogs(data){
    let filePath = './Files/logs.txt'
    fs.appendFile(filePath, `${data}\n`, () => {})
}

