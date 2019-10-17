var DBUtils = new function () {
    this.database = null;
    this.initDatabase = function (arrModels) {
        this.database = window.sqlitePlugin.openDatabase({
            name: 'ventroc.db',
            location: 'default'
        });
        this.database.transaction(function (transaction) {
            for (var i = 0; i < arrModels.length; i++) {
                var modeljs = arrModels[i];
                if (modeljs != null) {
                    var pos = modeljs.lastIndexOf('.js');
                    if (pos != -1) {

                        str = modeljs.substring(0, pos) + modeljs.substring(pos + 3);
                        var unicos = eval(str + ".unicos;");
                        try {
                            var name = eval(str + ".tableName;");
                            var fields = eval(str + ".fields.join();");

                            var u = "";
                            if (unicos != undefined) {
                                unicos = unicos.join();
                                u = ", CONSTRAINT campos_unicos UNIQUE (" + unicos + ")";
                            }
                            transaction.executeSql("CREATE TABLE IF NOT EXISTS " + name + " (" + fields + u + ")");
                        } catch (e) {
                            //console.log(str + " error db " + arrModels[i]);
                        }
                    }
                }
            }
            Notificacion.cargaNotificaciones(transaction);
        }, function (error) {
            //console.log('error al crear la base ' + error.message);
        }, function () {
            //console.log('base de datos creada');
        });
    };

    this.executequery = function (q, onsuccess, onError) { //funcion generica de insertado
        if (DBUtils.database != null) { // verificamos la base

            this.database.transaction(function (transaction) {
                transaction.executeSql(q.q, (q.fields != null ? q.fields : []), (onsuccess != null) ? onsuccess : function () {}, onError != null ? onError : function () {});
            });
        } else {
            return -1;
        }
    }

    this.buildqueryUpdate = function (objtable, objUpdate) { // funcion generica actualizado
        var arrayval = new Array();
        var arraycol = new Array();
        var keys = Object.keys(objUpdate);
        for (var i = 0; i < objtable.fields.length; i++) {
            var f = false;
            for (var j = 0; j < keys.length; j++) {
                if (objtable.fields[i] == keys[j]) {
                    arraycol.push(objtable.fields[i] + " = ?");
                    arrayval.push(objUpdate[objtable.fields[i]]);
                    f = true;
                    break;
                }
            }

        }
        var queryUpdate = null;
        if (arrayval.length > 0) {
            var queryUpdate = {
                q: ("UPDATE " + objtable.tableName + " SET " + arraycol.join() + " where rowid=" + objUpdate.rowid),
                fields: arrayval
            };
        }

        return queryUpdate;

    }

    this.buildqueryUpdateColumnMultipleId = function (objtable, column, value, idsArray) { // funcion generica actualizado

        var whereString = "";
        for (var k = 0; k < idsArray.length; k++) {
            whereString += "rowid=" + idsArray[k] + " ";
            if (k != idsArray.length - 1)
                whereString += "OR ";
        }
        var query = "UPDATE " + objtable.tableName + " SET " + column + "=" + value + " where " + whereString + ";";
        //console.log(query);
        var queryUpdate = null;
        var queryUpdate = {
            q: query,
            fields: []
        };
        return queryUpdate;
    }
    
    this.buildqueryUpdateByColumn = function (objtable, objUpdate, column, valueColumn) { // funcion generica actualizado
        var arrayval = new Array();
        var arraycol = new Array();
        var keys = Object.keys(objUpdate);
        for (var i = 0; i < objtable.fields.length; i++) {
            var f = false;
            for (var j = 0; j < keys.length; j++) {
                if (objtable.fields[i] == keys[j]) {
                    arraycol.push(objtable.fields[i] + " = ?");
                    arrayval.push(objUpdate[objtable.fields[i]]);
                    f = true;
                    break;
                }
            }

        }
        var queryUpdate = null;
        if (arrayval.length > 0) {
            var queryUpdate = {
                q: ("UPDATE " + objtable.tableName + " SET " + arraycol.join() + " where "+column+"=" + valueColumn),
                fields: arrayval
            };
        }

        return queryUpdate;

    }
    
    
    this.buildqueryInsert = function (objtable, objInsert) { // funcion generica de insertado
        var arrayval = new Array();
        var arraycol = new Array();
        var arraynumfields = new Array();
        var keys = Object.keys(objInsert);
        for (var i = 0; i < objtable.fields.length; i++) {
            var f = false;
            for (var j = 0; j < keys.length; j++) {
                if (objtable.fields[i] == keys[j]) {
                    arraycol.push(objtable.fields[i]);
                    arrayval.push(objInsert[objtable.fields[i]]);
                    arraynumfields.push("?");
                    f = true;
                    break;
                }
            }
        }
        var queryinsert = null;
        if (arrayval.length > 0) {
            var queryinsert = {
                q: "INSERT INTO " + objtable.tableName + " (" + arraycol.join() + ") values (" + arraynumfields.join() + ")",
                fields: arrayval
            };
        }
        return queryinsert;
    }
}