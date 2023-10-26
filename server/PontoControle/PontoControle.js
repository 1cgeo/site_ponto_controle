
const { Pool } = require('pg');
 
module.exports = async function consoleLogQuery(){
  const pool = new Pool({
    user: `${process.env.USER}`,
    host: `${process.env.HOST_DATABASE}`,
    database: `${process.env.DATABASE_NAME}`,
    password: `${process.env.PASSWORD}`,
    port: process.env.PORT,
  });

  var jsonGeom = await pool.query(
    `
    SELECT jsonb_build_object(
      'type',       'Feature',
      'id',         id,
      'geometry',   ST_AsGeoJSON(geom)::jsonb,
      'properties', to_jsonb( t.* ) - 'id' - 'geom'
      ) AS json
    FROM bpc.ponto_controle_p AS t;
    `
  );
  var features = [];
  jsonGeom.rows.forEach(element => {
    var content = {
      "type": element.json.type,
      "geometry": element.json.geometry,
      "properties": element.json.properties
    }
    features.push(content);
  });
  var geoJson = {
    "type": "FeatureCollection",
    "features": features
  }
  return geoJson;
};
