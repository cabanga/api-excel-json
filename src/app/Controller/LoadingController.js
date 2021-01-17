const LoadingRepo = require('../Repositories/LoadingRepo')

exports.store = (req, res) => {
    try {
        const read_file = LoadingRepo.readFile()
        res.status(201).send(read_file)
    } catch (err) {
        res.status(500).send({errors: err})
    }
}
