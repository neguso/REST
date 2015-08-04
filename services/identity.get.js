var restify = require('restify'),
    mssql = require('mssql'),
    q = require('q');

var config = require('../config.js');


module.exports = function(filter, order, skip, take, fields)
{
  var defer = q.defer();
  
  // fields
  var aryFields = [];
  if(typeof fields !== 'undefined')
  {
    // remove unknown and duplicate fields
    fields.split(',').forEach(function(item)
    {
      item = item.trim();
      if(mapEmployees.hasOwnProperty(item) && aryFields.indexOf(item) === -1)
        aryFields.push(item);
    });
  }
  if(aryFields.length === 0)
    aryFields = ['Identity', 'FirstName', 'LastName'];
  
  // order


  return defer.promise;
}

var employees = {

 fields: {
    Identity: 'Employees.Email AS [Identity]',
    FirstName: 'Employees.FirstName',
    LastName: 'Employees.LastName',
    Birthday: 'Employees.Birthday',
    Email: 'Employees.Email',
    Skype: 'Employees.Skype',
    Phone: 'Employees.Phone',
    JobPosition: 'COALESCE(Employees.JobPosition, Employees.Position) AS JobPosition',
    OfficeLocation: 'OfficeLocations.DisplayName AS OfficeLocation',
    Area: 'Areas.Name AS Area',
    Avatar: '\'{avatar}\' AS Avatar'
  },
  sql: 'SELECT {fields} FROM Employees LEFT OUTER JOIN Areas ON Employees.Area = Areas.Oid LEFT OUTER JOIN Sites ON Employees.Site = Sites.Oid LEFT OUTER JOIN OfficeLocations ON Employees.OfficeLocation = OfficeLocations.Oid LEFT OUTER JOIN CompetenceCenters ON Employees.CompetenceCenter = CompetenceCenters.Oid WHERE NOT (Employees.Email IS NULL OR LEN(LTRIM(Employees.Email)) = 0) ORDER BY {order} OFFSET {skip} ROWS FETCH NEXT {take} ROWS ONLY; SELECT COUNT(*) AS Count FROM Employees WHERE NOT (Employees.Email IS NULL OR LEN(LTRIM(Employees.Email)) = 0)'

};
