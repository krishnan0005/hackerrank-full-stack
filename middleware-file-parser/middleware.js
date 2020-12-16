const ROLES_FILE = __dirname + '/roles.txt';
const { all } = require('bluebird');
const fs = require('fs');


module.exports = (scope) => (req, res, next) => {

    const role = req.headers['x-role'];
    if(role){
        fs.readFile(ROLES_FILE, "utf8", (err, data) => {
            if(err){
              res.status(500).json({});
            } 
            const [localScope, action] = scope.split('.');
            let mapper = {};
            let splitted = data.toString().split("\n");
            for (let i = 0; i<splitted.length; i++) {
                let splitLine = splitted[i].split(":");
                mapper[splitLine[0]] = splitLine[1].trim();
            }
            console.log(mapper);
            mapper.forEach(i => {
                if(role === i.role){
                    const  { scopes } = i;
                    if(scopes[localScope]){
                        const allowed = scopes[localScope] && scopes[localScope].includes(action); 
                        if(allowed){
                            next();
                        }
                    }
                }
            })
         });
    } else {
        res.status(401).json({})
    }

};
