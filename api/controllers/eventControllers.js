const {Evento} = require('../models/eventModel');

/* Essa função lista todos os eventos do Banco */
const listarEventos= async(req,res)=>{
    /* Coloca-se a visibilidade do _id e o __V como falsa */
    Evento.find({}, {_id:true, __v:false}).then(result =>{
        res.status(200).send(result)
    }).catch(e=> res.status(400).send(e));
};

/* Essa função salva um novo evento no Banco */
const salvarEvento = async (req,res) =>{    
    /* Aqui é criado um novo objeto do tipo Evento */
    Evento.create(req.body).then(result => console.log(result));
    res.send("Evento Salvo com sucesso!");
};

/* Essa função possibilita editar e atualizar um evento cadastrado no Banco */
const editarEvento = async (req,res) =>{
    /* O evento é buscado pelo id */    
    Evento.findById(req.params.id).then(result =>{
        if(result){
            result.set(req.body);
            result.save();
            res.status(200).send('Evento atualizado com sucesso');
        }
    }).catch(e => res.status(404).send('Evento não encontrada'));    
};

/* Essa função deleta um evento cadastrado no Banco */
const deletarEvento = async (req,res)=>{   
    Evento.deleteOne({_id:req.params.id}).then(result => {
        if(result.deletedCount > 0) res.status(200).send('Removido com sucesso');
        else res.status(404).send('Evento não encontrada');
    }).catch(e => res.status(400).send(e));
};

/* Essa função faz buscas de texto nos eventos e traz aqueles que contém o texto */
const buscarEvento = async (req,res) =>{
    /* Recebe um texto e faz busca*/
    Evento.find({$text:{$search:req.params.texto}},{_id:true, __v:false}).then(result => {
        res.status(200).send(result);
    }).catch(e => res.status(400).send(e));
                
};


module.exports = {listarEventos, salvarEvento, editarEvento, deletarEvento, buscarEvento};
