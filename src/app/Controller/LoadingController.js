//const LoadingRepo = require('../Repositories/LoadingRepo')

import { loadInvoice } from '../Repositories/LoadingRepo'

exports.store = (req, res) => {
    try {
        const read_file = loadInvoice()
        res.status(201).send(read_file)
    } catch (err) {
        res.status(500).send({errors: err})
    }
}
