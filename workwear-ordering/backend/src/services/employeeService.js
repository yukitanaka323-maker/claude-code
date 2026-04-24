const { graphRequest } = require('./sharepointAuth');
const config = require('../config/sharepoint');

const listPath = () =>
  `/sites/${config.siteId}/lists/${config.listIds.employees}/items`;

async function findByAuthNumber(authNumber) {
  const encoded = encodeURIComponent(`fields/AuthNumber eq '${authNumber}' and fields/IsActive eq true`);
  const data = await graphRequest(
    'GET',
    `${listPath()}?$filter=${encoded}&$expand=fields&$top=1`
  );
  if (!data.value || data.value.length === 0) return null;
  const fields = data.value[0].fields;
  return {
    employeeId: fields.Title,
    employeeName: fields.EmployeeName,
    department: fields.Department,
    isAdmin: !!fields.IsAdmin,
  };
}

module.exports = { findByAuthNumber };
