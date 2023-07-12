const driver = require('../dataBase/neo4jDB');

const contarUsuariosParticiparam = async (req, res) => {
  try {
    const eventId = req.params.id;
    const session = driver.session();
    const query = `MATCH (u:Usuario)-[:PARTICIPOU]->(e:Evento {id: $eventId})
                   RETURN count(u) as total`;
    const result = await session.run(query, { eventId: eventId });
    const total = result.records[0].get('total').toNumber();
    res.status(200).json({ total });
  } catch (error) {
    console.error('Erro ao contar usuários:', error);
    res.status(500).json({ error: 'Erro ao contar usuários' });
  }
};
const contarUsuariosGostaram = async (req, res) => {
  try {
    const eventId = req.params.id;
    const session = driver.session();
    const query = `MATCH (u:Usuario)-[:GOSTOU]->(e:Evento {id: $eventId})
                   RETURN count(u) as total`;
    const result = await session.run(query, { eventId: eventId });
    const total = result.records[0].get('total').toNumber();
    res.status(200).json({ total });
  } catch (error) {
    console.error('Erro ao contar usuários:', error);
    res.status(500).json({ error: 'Erro ao contar usuários' });
  }
};
const likeEvent = async(req, res) =>{
  try {
    const { usuarioId, eventoId } = req.body;
    const session = driver.session();
    const criarUsuarioQuery = `
      MERGE (u:Usuario {id: $usuarioId})
      RETURN u
    `;
    await session.run(criarUsuarioQuery, { usuarioId });  
    const criarEventoQuery = `
      MERGE (e:Evento {id: $eventoId})
      RETURN e
    `;
    await session.run(criarEventoQuery, { eventoId });  
    const query = `
      MATCH (u:Usuario), (e:Evento)
      WHERE u.id = $usuarioId AND e.id = $eventoId
      CREATE (u)-[:GOSTOU]->(e)
    `;
    const params = { usuarioId, eventoId };
    await session.run(query, params);  
    console.log('Relação de "gostou" criada com sucesso');
    res.status(200).json({ message: 'Relação de "gostou" criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar a relação de "gostou":', error);
    res.status(500).json({ error: 'Erro ao criar a relação de "gostou"' });
  };
};
const dislikeEvent = async (req, res) => {
  try {
    const { usuarioId, eventoId } = req.body;
    const session = driver.session();
    const checkRelationQuery = `
      MATCH (u:Usuario {id: $usuarioId})-[g:GOSTOU]->(e:Evento {id: $eventoId})
      RETURN g
    `;
    const params = { usuarioId, eventoId };
    const result = await session.run(checkRelationQuery, params);
    const relationship = result.records[0].get('g');
    if (relationship) {
      const deleteRelationQuery = `
        MATCH (u:Usuario {id: $usuarioId})-[g:GOSTOU]->(e:Evento {id: $eventoId})
        DELETE g
      `;
      await session.run(deleteRelationQuery, params);
      console.log('Relacionamento "gostou" removido com sucesso');
      res.status(200).json({ message: 'Relacionamento "gostou" removido com sucesso' });
    } else {
      console.log('Relacionamento "gostou" não encontrado');
      res.status(404).json({ error: 'Relacionamento "gostou" não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao remover o relacionamento "gostou":', error);
    res.status(500).json({ error: 'Erro ao remover o relacionamento "gostou"' });
  }
};
const SubscribeEvent = async(req, res) =>{
  try {
    const { usuarioId, eventoId } = req.body;
    const session = driver.session();
    const criarUsuarioQuery = `
      MERGE (u:Usuario {id: $usuarioId})
      RETURN u
    `;
    await session.run(criarUsuarioQuery, { usuarioId });  
    const criarEventoQuery = `
      MERGE (e:Evento {id: $eventoId})
      RETURN e
    `;
    await session.run(criarEventoQuery, { eventoId });  
    const query = `
      MATCH (u:Usuario), (e:Evento)
      WHERE u.id = $usuarioId AND e.id = $eventoId
      CREATE (u)-[:PARTICIPOU]->(e)
    `;
    const params = { usuarioId, eventoId };
    await session.run(query, params);  
    console.log('Relação de "participou" criada com sucesso');
    res.status(200).json({ message: 'Relação de "participou" criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar a relação de "participouu":', error);
    res.status(500).json({ error: 'Erro ao criar a relação de "participou"' });
  };
};
const removeSubscribeEvent = async (req, res) => {
  try {
    const { usuarioId, eventoId } = req.body;
    const session = driver.session();
    const checkRelationQuery = `
      MATCH (u:Usuario {id: $usuarioId})-[g:PARTICIPOU]->(e:Evento {id: $eventoId})
      RETURN g
    `;
    const params = { usuarioId, eventoId };
    const result = await session.run(checkRelationQuery, params);
    const relationship = result.records[0].get('g');
    if (relationship) {
      const deleteRelationQuery = `
        MATCH (u:Usuario {id: $usuarioId})-[g:PARTICIPOU]->(e:Evento {id: $eventoId})
        DELETE g
      `;
      await session.run(deleteRelationQuery, params);
      console.log('Relacionamento "participou" removido com sucesso');
      res.status(200).json({ message: 'Relacionamento "participou" removido com sucesso' });
    } else {
      console.log('Relacionamento "participou" não encontrado');
      res.status(404).json({ error: 'Relacionamento "participou" não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao remover o relacionamento "participou":', error);
    res.status(500).json({ error: 'Erro ao remover o relacionamento "participou"' });
  }
};
const verificarLike = async (req, res) => {
  try {
    const { usuarioId, eventoId } = req.body;

    const session = driver.session();

    const query = `
    MATCH (u:Usuario {id: $usuarioId})
    OPTIONAL MATCH (u)-[g:GOSTOU]->(e:Evento {id: $eventoId})
    RETURN g    
    `;
    const params = { usuarioId, eventoId };

    const result = await session.run(query, params);
    const relationship = result.records[0].get('g');

    const existeRelacionamento = !!relationship;

    session.close(); 

    res.status(200).json({ existeRelacionamento });
  } catch (error) {
    console.error('Erro ao verificar o relacionamento "gostou":', error);
    res.status(500).json({ error: 'Erro ao verificar o relacionamento "gostou"' });
  } 
};
const verificarSubscribe = async (req, res) => {
  try {
    const { usuarioId, eventoId } = req.body;

    const session = driver.session();

    const query = `
    MATCH (u:Usuario {id: $usuarioId})
    OPTIONAL MATCH (u)-[g:PARTICIPOU]->(e:Evento {id: $eventoId})
    RETURN g    
    `;
    const params = { usuarioId, eventoId };

    const result = await session.run(query, params);
    const relationship = result.records[0].get('g');

    const existeRelacionamento = !!relationship;

    session.close(); 

    res.status(200).json({ existeRelacionamento });
  } catch (error) {
    console.error('Erro ao verificar o relacionamento "gostou":', error);
    res.status(500).json({ error: 'Erro ao verificar o relacionamento "gostou"' });
  } 
};


module.exports = { SubscribeEvent, removeSubscribeEvent,  contarUsuariosParticiparam, contarUsuariosGostaram, likeEvent, dislikeEvent, verificarLike, verificarSubscribe };
