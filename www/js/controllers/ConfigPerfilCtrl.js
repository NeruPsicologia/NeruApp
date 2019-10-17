var ConfigPerfilCtrl = new function ()
{
    this.btnPerfilCondomino = null;
    this.btnPerfilVigilancia = null;
    this.idPage = "page-perfil";
    this.doAction = function (perfil) {
        $.mobile.loading('show');
        Config.setPerfil(perfil);
        ConfigPerfilCtrl.btnPerfilVigilancia.option("disabled", true);
        ConfigPerfilCtrl.btnPerfilCondomino.option("disabled", true);
        ConfigPerfilCtrl.CargaCssJs(perfil);
    }


    this.main = function () {
        ConfigPerfilCtrl.btnPerfilCondomino = $("#btnPerfilCondomino").dxButton({
            text: 'Residente',
            "icon": "user",
            onClick: function () {
                ConfigPerfilCtrl.doAction(Config.perfiles[0]);
            }
        }).dxButton("instance");
        ConfigPerfilCtrl.btnPerfilVigilancia = $("#btnPerfilVigilancia").dxButton({
            text: 'Vigilancia',
            "icon": "key",
            onClick: function () {
                ConfigPerfilCtrl.doAction(Config.perfiles[1]);
            }
        }).dxButton("instance");
    };

    this.cargaJsPerfilCondomino = function () {
        Config.pathModels = "www/condomino/js/models/";
        Config.pathControllers = "www/condomino/js/controllers/";
        $.getScript("condomino/js/db.js", function (data, textStatus, jqxhr) {
            $.getScript("condomino/js/utils.js", function (data, textStatus, jqxhr) {
                $.getScript("condomino/js/models/Notificacion.js", function (data, textStatus, jqxhr) {
                    $.getScript("condomino/js/models/Sesion.js", function (data, textStatus, jqxhr) {
                        $.getScript("condomino/js/presentacion.js", function (data, textStatus, jqxhr) {
                            $.mobile.loading('hide');
                        });
                    });

                });

            });
        });
    }

    this.cargaJsPerfilVigilancia = function () {
        Config.pathModels = "www/vigilancia/js/models/";
        Config.pathControllers = "www/vigilancia/js/controllers/";
        $.getScript("vigilancia/js/db.js", function (data, textStatus, jqxhr) {
            $.getScript("vigilancia/js/utils.js", function (data, textStatus, jqxhr) {
                $.getScript("vigilancia/js/presentacion.js", function (data, textStatus, jqxhr) {
                    $.mobile.loading('hide');
                });
            });
        });
    }

    this.cargaCssPerfil = function (perfil) {
        var path = "";

        if (perfil.idPerfil == 1) {
            path = "condomino";
        } else {
            path = "vigilancia";
        }

        $.getScript(path + "/js/styles.js", function (data, textStatus, jqxhr) {
            for (var i = 0; i < stylesAPP.length; i++) {
                ConfigPerfilCtrl.addCss(stylesAPP[i]);
            }
        });

    }

    this.addCss = function (str) {
        $('<link>').attr("rel", "stylesheet")
                .attr("type", "text/css")
                .attr("href", str)
                .appendTo("head");
    }

    this.CargaCssJs = function (perfil) {
        if (perfil.idPerfil == 1) {
            ConfigPerfilCtrl.cargaCssPerfil(perfil);
            ConfigPerfilCtrl.cargaJsPerfilCondomino();


        } else {
            if (perfil.idPerfil == 2) {
                ConfigPerfilCtrl.cargaCssPerfil(perfil);
                ConfigPerfilCtrl.cargaJsPerfilVigilancia();

            }

        }

    }


}

$(document).on("pageinit", "#" + ConfigPerfilCtrl.idPage, function (e) {
    ConfigPerfilCtrl.main();
});