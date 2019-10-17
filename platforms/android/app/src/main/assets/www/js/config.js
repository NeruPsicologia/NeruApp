var Config = new function ()
{
    this.pathModels = "www/neru/js/models/";
    this.pathControllers = "www/neru/js/controllers/";
    //produccion
    //this.urlNodeJS = "http://67.205.96.42";
    //this.port = "2085";
    //local
    //this.urlNodeJS = "http://192.168.3.51";
    //this.port = "8081";
    this.urlNodeJS = "http://192.168.1.122";
    this.port = "8080";
    this.controllers = new Array();
    this.internetSevices = true;
    this.busySincronize = false;
    this.busySincronize2 = false;
    this.neru = "PRUEBA";
    

    //vigilancia
    this.sessionWarnAfter = 3000;
    this.sessionRedirAfter = 3000000;
    this.sessionRedirUrl = "presentacion.html";
    this.idCluster = "15";
    this.photoQuality = 50;
    this.photoTargetWidth = 400;
    this.photoTargetHeight = 400;
    this.numPhotosReporte = 3;
    this.modulesEnables = {
        directorio: true,
        pagos: true,
        reportes: true,
        areas: false,
        alarma: false,
        favoritos: true,
    };


    this.checkConfig = function () {
        var perfil = Config.getPerfil();

        if (perfil == null)
        {            //proceso de configuracion
            $.mobile.changePage('page-perfil.html', {});
        } else {
            //proceso de configuracion
            if (perfil.idPerfil == 1) {
                ConfigPerfilCtrl.CargaCssJs(perfil);

            } else {
                if (perfil.idPerfil == 2) {
                    ConfigPerfilCtrl.CargaCssJs(perfil);
                }
            }
        }
    }


    this.getPerfil = function () {
        if (typeof (Storage) !== "undefined")
        {
            var value = localStorage.getItem("perfil");
            if (!value) {
                return null;
            }
            if (value[0] === "{") {
                value = JSON.parse(value);
            }
            return value;
        }
    };

    this.setPerfil = function (perfil) {
        if (typeof (Storage) !== "undefined")
        {
            localStorage.setItem("perfil", JSON.stringify(perfil));
        }
    };
}