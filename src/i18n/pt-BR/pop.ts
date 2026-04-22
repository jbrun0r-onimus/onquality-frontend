export const pop = {
  title: 'POPs',
  common: {
    sim: 'SIM',
    nao: 'NÃO',
    na: 'NA',
    conditions: 'CONDIÇÕES',
    condition: 'Condição',
    createdAt: 'Criado em',
    exportPdf: 'Exportar PDF',
    evidences: 'Evidências / Registros Fotográficos',
    addEvidences: 'Adicionar Fotos',
    takePhoto: 'Tirar Foto',
    noEvidences: 'Nenhuma evidência registrada.',
    deleteEvidenceConfirmation: 'Deseja remover esta evidência?',
  },
  cargoInspection: {
    titles: {
      list: 'Inspeção de Carga e Veículos',
      details: 'Detalhes da Inspeção',
      new: 'Nova Inspeção de Carga',
      edit: 'Editar Inspeção de Carga',
      delete: 'Excluir Inspeção',
    },
    fields: {
      driver: 'Motorista',
      licensePlate: 'Placa',
      invoice: 'Nota Fiscal',
      product: 'Produto',
      type: 'Tipo',
      inbound: 'Recebimento',
      outbound: 'Expedição',
      monitoredBy: 'Monitorado por',
      verifiedBy: 'Verificado por',
      note: 'Observações',
    },
    questions: {
      q1: 'O veículo está com parte interna limpa, livre de pó, poeira, vestígios de pragas e resíduos de cargas anteriores?',
      q2: 'O veículo está em bom estado de conservação? *Verificar tanto a parte externa como internamente.*',
      q3: 'O veículo está sem furos, frestas, goteiras ou pontos de umidade internamente?',
      q4: 'O veículo está livre de odores fortes e/ou estranhos?',
      q5: 'O piso do veículo encontra-se limpo, é forrado com lona ou o produto está sobre paletes?',
      q6: 'Houve transporte de cargas anteriores? Se sim, escrever as três últimas:',
      q7: 'Há transporte de materiais tóxicos ou produtos químicos juntos com alimento e/ou embalagens?',
      q8: 'A lona está limpa, tem boa espessura e é resistente?',
      q9: 'Foi colocado forro plástico no lastro do caminhão?',
      q10: 'Em caso de caminhão aberto, a lona é suficiente para cobertura total da carga e do lastro?',
      q11: 'A carga está sem avarias?',
      q12: 'A carga está sem sinais de infestação por pragas ou sinais visíveis de ocorrência destes?',
      q13: 'Os paletes utilizados estão em bom estado de conservação, limpos e secos?',
      q14: 'O lote do produto e as quantidades conferem com os dados descritos na NF?',
      q15: 'As matérias-primas são recebidas com a identificação de número de lote, data de fabricação e validade?',
      q16: 'Matéria prima ensacada devidamente rotulada?',
      q17: 'Matéria prima a granel, rótulo anexada a NF?',
      q18: 'Rotulagem com letras legíveis?',
      q19: 'As embalagens estão íntegras e sem sinais de fraude?',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir a inspeção do motorista "{driver}"?',
    },
    feedback: {
      created: 'Inspeção de carga criada com sucesso.',
      updated: 'Inspeção de carga atualizada com sucesso.',
      deleted: 'Inspeção de carga excluída com sucesso.',
    },
  },
  materialReceiving: {
    titles: {
      list: 'Controle de Recebimento de Matérias-Primas',
      details: 'Detalhes do Recebimento',
      new: 'Novo Recebimento de Matéria-Prima',
      edit: 'Editar Recebimento',
      delete: 'Excluir Recebimento',
    },
    fields: {
      supplier: 'Fornecedor',
      product: 'Produto',
      receivingDate: 'Data do Recebimento',
      batchNumber: 'Lote',
      weight: 'Peso (kg)',
      expirationDate: 'Data de Validade',
      invoice: 'Nº NF',
      performedBy: 'Executor',
    },
    questions: {
      q1: 'Integridade da(s) embalagem(ns)',
      q2: 'Condições físicas do(s) produto(s)',
      q3: 'Informações do rótulo',
      q4: 'Condições higiênicas do transporte',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir o recebimento do fornecedor "{supplier}"?',
    },
    feedback: {
      created: 'Recebimento criado com sucesso.',
      updated: 'Recebimento atualizado com sucesso.',
      deleted: 'Recebimento excluído com sucesso.',
    },
  },
  monitoringRoom: {
    titles: {
      list: 'Frequência de Limpeza - Instalações',
      details: 'Detalhes do Monitoramento',
      new: 'Novo Registro de Limpeza',
      edit: 'Editar Registro',
      delete: 'Excluir Registro',
    },
    fields: {
      executionDate: 'Data de Execução',
      location: 'Local',
      isCleaning: 'Limpeza Realizada',
    },
    locations: {
      adminArea: 'Áreas de Administração e Sala de Apoio',
      floor: 'Piso',
      wall: 'Parede',
      coffeeMaker: 'Cafeteira',
      acFilter: 'Ar Condicionado filtro',
      windowsDoors: 'Janelas e Porta',
      cabinets: 'Armários',
      birdsTables: 'Birds/Mesas',
      lights: 'Luminárias',
      bins: 'Lixeiras',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este registro de "{location}"?',
    },
    feedback: {
      created: 'Registro de limpeza criado com sucesso.',
      updated: 'Registro de limpeza atualizado com sucesso.',
      deleted: 'Registro de limpeza excluído com sucesso.',
    },
  },
  monitoringEquipments: {
    titles: {
      list: 'Frequência de Limpeza - Equipamentos',
      details: 'Detalhes do Monitoramento',
      new: 'Novo Registro de Limpeza',
      edit: 'Editar Registro',
      delete: 'Excluir Registro',
    },
    fields: {
      executionDate: 'Data de Execução',
      equipment: 'Equipamento',
      isCleaning: 'Limpeza Realizada',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este registro de "{equipment}"?',
    },
    feedback: {
      created: 'Registro de limpeza criado com sucesso.',
      updated: 'Registro de limpeza atualizado com sucesso.',
      deleted: 'Registro de limpeza excluído com sucesso.',
    },
  },
  sanitationControl: {
    titles: {
      list: 'Check-List de Controle de Higiene',
      details: 'Detalhes do Check-List',
      new: 'Novo Check-List de Higiene',
      edit: 'Editar Check-List',
      delete: 'Excluir Check-List',
    },
    fields: {
      executionDate: 'Data de Execução',
    },
    questions: {
      q1: 'Os uniformes dos funcionários estão limpos e em bom estado de conservação?',
      q2: 'Os calçados são adequados e limpos?',
      q3: 'Os funcionários estão devidamente barbeados?',
      q4: 'Os funcionários estão com cabelos cobertos?',
      q5: 'Os funcionários não estão utilizando adornos (pulseira, anéis, cordões, brincos, alianças, etc.)?',
      q6: 'Os funcionários sempre praticam atitudes higiênicas, como não tossir, espirrar sobre os produtos, equipamentos e instalações, não levar a mão à boca e nariz, não cuspir no ambiente, etc., evitando contaminação?',
      q7: 'Os funcionários utilizam EPIs adequados durante a manipulação e produção?',
      q8: 'Os funcionários cumprem as recomendações de lavar e sanificar as mãos e antebraços antes de entrar na área de produção?',
      q9: 'Os funcionários cumprem as normas de higiene pessoal conforme os procedimentos estabelecidos?',
      q10: 'Os funcionários não apresentam algum tipo de ferimentos ou outras lesões nas mãos, infecções ou problemas gastrointestinais?',
      q11: 'Os funcionários cumprem as recomendações de não alimentar, mascar chicletes, palitos, etc. na área de trabalho?',
      q12: 'Existem cartazes educativos para os colaboradores e visitantes nas áreas de acesso aos ambientes de processamento, vestiários e sanitários?',
      q13: 'A instalação sanitária (vasos, pias, chuveiros) está funcionando adequadamente?',
      q14: 'Há disponibilidade de sabonete líquido inodoro antisséptico, água, papel toalha não reciclado e papel higiênico na instalação sanitária?',
      q15: 'Há disponibilidade de sabão antisséptico, água, papel toalha não reciclado nos lavatórios de mãos?',
      q16: 'Os uniformes são trocados diariamente?',
      q17: 'Os funcionários não usam perfume que possa transmitir aos produtos?',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este check-list?',
    },
    feedback: {
      created: 'Check-list criado com sucesso.',
      updated: 'Check-list atualizado com sucesso.',
      deleted: 'Check-list excluído com sucesso.',
    },
  },
  trainingLog: {
    titles: {
      list: 'Registro de Treinamento',
      details: 'Detalhes do Registro',
      new: 'Novo Registro de Treinamento',
      edit: 'Editar Registro',
      delete: 'Excluir Registro',
    },
    fields: {
      employeeName: 'Nome do Funcionário',
      isPresent: 'Presente',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir o registro de "{name}"?',
    },
    feedback: {
      created: 'Registro criado com sucesso.',
      updated: 'Registro atualizado com sucesso.',
      deleted: 'Registro excluído com sucesso.',
    },
  },
  waterCoolerSanitization: {
    titles: {
      list: 'Higienização do Bebedouro',
      details: 'Detalhes da Higienização',
      new: 'Nova Higienização',
      edit: 'Editar Higienização',
      delete: 'Excluir Higienização',
    },
    fields: {
      executionDate: 'Data',
      employeeSignature: 'Assinatura do Responsável',
      note: 'Observações',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este registro de higienização?',
    },
    feedback: {
      created: 'Higienização registrada com sucesso.',
      updated: 'Higienização atualizada com sucesso.',
      deleted: 'Higienização excluída com sucesso.',
    },
  },
  changeWaterCoolerFilter: {
    titles: {
      list: 'Troca do Filtro do Bebedouro',
      details: 'Detalhes da Troca de Filtro',
      new: 'Nova Troca de Filtro',
      edit: 'Editar Troca de Filtro',
      delete: 'Excluir Troca de Filtro',
    },
    fields: {
      executionDate: 'Data',
      employeeSignature: 'Assinatura do Responsável',
      note: 'Observações',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este registro de troca de filtro?',
    },
    feedback: {
      created: 'Troca de filtro registrada com sucesso.',
      updated: 'Troca de filtro atualizada com sucesso.',
      deleted: 'Troca de filtro excluída com sucesso.',
    },
  },
  sanitizationControl: {
    titles: {
      list: 'Controle de Higienização das Caixas',
      details: 'Detalhes do Controle',
      new: 'Novo Controle de Higienização',
      edit: 'Editar Controle',
      delete: 'Excluir Controle',
    },
    fields: {
      boxNumber: 'Caixa',
      executionDate: 'Data da Higienização',
      nextExecutionDate: 'Próxima Higienização',
      employeeName: 'Executado por',
      boxOption1: 'Caixa 1 - Água usada pela peletizadora',
      boxOption2: 'Caixa 2 - Água usada na copa, sala de apoio e banheiro',
    },
    questions: {
      q1: 'Eficiência da higienização',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este controle de higienização?',
    },
    feedback: {
      created: 'Controle de higienização criado com sucesso.',
      updated: 'Controle de higienização atualizado com sucesso.',
      deleted: 'Controle de higienização excluído com sucesso.',
    },
  },
  maintenanceControl: {
    titles: {
      list: 'Controle de Manutenção das Caixas',
      details: 'Detalhes do Controle de Manutenção',
      new: 'Novo Controle de Manutenção',
      edit: 'Editar Controle',
      delete: 'Excluir Controle',
    },
    fields: {
      boxNumber: 'Caixa',
      executionDate: 'Data',
      employeeName: 'Executado por',
      boxOption1: 'Caixa 1 - Água usada pela peletizadora',
      boxOption2: 'Caixa 2 - Água usada na copa, sala de apoio e banheiro',
    },
    questions: {
      q1: 'Tampa com vedação e ausente de trincas?',
      q2: 'Vazamentos/Infiltrações',
      q3: 'Descascamentos',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este controle de manutenção?',
    },
    feedback: {
      created: 'Controle de manutenção criado com sucesso.',
      updated: 'Controle de manutenção atualizado com sucesso.',
      deleted: 'Controle de manutenção excluído com sucesso.',
    },
  },
  cleaningSuppliesControl: {
    titles: {
      list: 'Controle de Material de Limpeza (Flushing)',
      details: 'Detalhes do Registro',
      new: 'Novo Registro de Limpeza',
      edit: 'Editar Registro',
      delete: 'Excluir Registro',
    },
    sections: {
      cleaning: 'Limpeza',
      reuse: 'Reutilização',
    },
    fields: {
      executionDate: 'Data da Limpeza',
      product: 'Produto Utilizado',
      weight: 'Peso (kg)',
      productionOrder: 'Nº Ordem de Produção',
      reuseDate: 'Data de Reutilização',
      reuseWeight: 'Peso (kg)',
      reuseProductionOrder: 'Nº Ordem de Produção / Lote',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este registro de limpeza?',
    },
    feedback: {
      created: 'Registro criado com sucesso.',
      updated: 'Registro atualizado com sucesso.',
      deleted: 'Registro excluído com sucesso.',
    },
  },
  maintenanceEquipmentsPop: {
    titles: {
      list: 'Manutenção de Equipamentos e Instrumentos',
      details: 'Detalhes da Manutenção',
      new: 'Nova Manutenção',
      edit: 'Editar Manutenção',
      delete: 'Excluir Manutenção',
    },
    fields: {
      executionDate: 'Data',
      type: 'Tipo',
      descriptions: 'Descrição do Procedimento',
      executedBy: 'Executor',
      diagnosis: 'Diagnóstico',
    },
    types: {
      preventive: 'Preventiva',
      corrective: 'Corretiva',
      damaged: 'Danificado',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este registro de manutenção?',
    },
    feedback: {
      created: 'Manutenção registrada com sucesso.',
      updated: 'Manutenção atualizada com sucesso.',
      deleted: 'Manutenção excluída com sucesso.',
    },
  },
  productionProcess: {
    titles: {
      list: 'Controle de Processo Produtivo',
      details: 'Detalhes do Processo',
      new: 'Novo Registro de Processo',
      edit: 'Editar Processo',
      delete: 'Excluir Processo',
    },
    fields: {
      product: 'Produto',
      frequency: 'Frequência do Monitoramento',
      executionDate: 'Data do Monitoramento',
      parameter: 'Registro dos Parâmetros',
      note: 'Medidas Corretivas',
      employeeName: 'Executor',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este registro de processo?',
    },
    feedback: {
      created: 'Processo registrado com sucesso.',
      updated: 'Processo atualizado com sucesso.',
      deleted: 'Processo excluído com sucesso.',
    },
  },
  checkListPest: {
    titles: {
      list: 'Check-List de Controle de Pragas e Resíduos',
      details: 'Detalhes do Check-List',
      new: 'Novo Check-List',
      edit: 'Editar Check-List',
      delete: 'Excluir Check-List',
    },
    fields: {
      note: 'Observações',
    },
    questions: {
      q1: 'As áreas ao redor das edificações apresentam material em desuso, grama e mato não aparado?',
      q2: 'Os portões externos estão adaptados com barreiras para proteções contra as pragas e estão em bom estado de conservação?',
      q3: 'Todas as aberturas estão adequadamente teladas?',
      q4: 'As telas estão limpas e em bom estado de conservação?',
      q5: 'Há presença de animais domésticos na área interna ou externa da fábrica?',
      q6: 'Há indicativos que demonstrem a presença de pragas tais como resíduos de fezes, animais mortos, penas ou pelos?',
      q7: 'Existe porta-iscas estrategicamente localizados e numerados?',
      q8: 'Os portas-iscas estão em bom estado de conservação?',
      q9: 'É observada a presença de insetos, roedores, morcegos e pássaros dentro das instalações da fábrica?',
      q10: 'Existe casa de lixo ou depósito fechado exclusivo para o armazenamento de resíduos fora da fábrica?',
      q11: 'As lixeiras estão identificadas e são limpas e higienizadas constantemente?',
      q12: 'As lixeiras possuem tampa, são constituídos de material de fácil limpeza e estão em bom estado de conservação?',
      q13: 'Os resíduos são retirados da fábrica diariamente?',
      q14: 'Existem alimentos estocados nos armários dos colaboradores?',
      q15: 'Os resíduos estão sendo recolhidos pela terceirizada, conforme previsto em contrato?',
      q16: 'No controle de pragas é utilizado produtos químicos registrados no Ministério da Saúde?',
      q17: 'Existe registro do controle de pragas (relatório de visitas, ordens de serviço, mapa de iscas)?',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este check-list?',
    },
    feedback: {
      created: 'Check-list criado com sucesso.',
      updated: 'Check-list atualizado com sucesso.',
      deleted: 'Check-list excluído com sucesso.',
    },
  },
  nonConformanceLog: {
    titles: {
      list: 'Registro de Não Conformidades',
      details: 'Detalhes da Não Conformidade',
      new: 'Nova Não Conformidade',
      edit: 'Editar Não Conformidade',
      delete: 'Excluir Não Conformidade',
    },
    fields: {
      product: 'Produto',
      address: 'Endereço',
      receivingDate: 'Data do Recebimento',
      mapRecord: 'N° Registro Mapa',
      details: 'Não Conformidade Detectada',
      deadline: 'Prazo para Cumprimento',
      isApproved: 'Reaprovado?',
      notes: 'Ação Corretiva',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este registro de não conformidade?',
    },
    feedback: {
      created: 'Não conformidade registrada com sucesso.',
      updated: 'Não conformidade atualizada com sucesso.',
      deleted: 'Não conformidade excluída com sucesso.',
    },
  },
  cleaningEfficiency: {
    titles: {
      list: 'Check-List de Eficiência de Limpeza',
      details: 'Detalhes do Check-List',
      new: 'Novo Check-List',
      edit: 'Editar Check-List',
      delete: 'Excluir Check-List',
    },
    fields: {
      executionDate: 'Data de Execução',
      note: 'Observações',
    },
    questions: {
      q1: 'Os produtos de higienização/desinfecção são aprovados pelos órgãos competentes (ANVISA ou Vigilância Sanitária)?',
      q2: 'Os detergentes estão disponíveis em quantidade suficiente para realização dos procedimentos de limpeza e sanificação?',
      q3: 'Os produtos de higienização contém substâncias odorizantes e/ou desodorizantes em suas formulações?',
      q4: 'Produtos de limpeza e higienização estão identificados e guardados em local adequado?',
      q5: 'Os utensílios (esponja, vassouras, rodos, etc) estão disponíveis e em bom estado de conservação para a realização da operação?',
      q6: 'A diluição dos produtos de higienização, tempo de contato e modo de uso/aplicação obedece às instruções recomendadas?',
      q7: 'Os encarregados pela limpeza e higienização utilizam os EPIs necessários para realização da operação?',
      q8: 'A área de processamento, equipamentos e utensílios são limpos de acordo com escala de periodicidade de limpeza/higienização?',
      q9: 'As instalações são providas de água fria em quantidade suficiente?',
      q10: 'Os paletes encontram-se limpos e em bom estado de conservação?',
      q11: 'Os banheiros e vestiários encontra-se em bom estado de conservação, limpos e organizados?',
      q12: 'Os lavatórios estão em bom estado de conservação e dotados de sabonete antisséptico ou inodoro, papel toalha e lixeiras?',
    },
    misc: {
      deleteConfirmation:
        'Você tem certeza que deseja excluir este check-list?',
    },
    feedback: {
      created: 'Check-list criado com sucesso.',
      updated: 'Check-list atualizado com sucesso.',
      deleted: 'Check-list excluído com sucesso.',
    },
  },
};
