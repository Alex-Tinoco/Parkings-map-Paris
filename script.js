const map = L.map('map').setView([48.8621375,2.3516501], 12);

// JSON

const tab = [];
fetch('https://opendata.saemes.fr/api/records/1.0/search/?dataset=referentiel-parkings-saemes&q=&rows=73&facet=nom_parking&facet=type_de_parc&facet=code_postal&facet=ville&facet=nombre_de_places&facet=hauteur_maximum&facet=erp_etablissements_recevant_du_public&facet=acces_motos&facet=acces_velos&facet=accessibilite_pmr&facet=liber_t&facet=carte_american_express&facet=reservation_de_place_sur_internet&facet=autopartage&facet=bornes_de_recharge_vehicule_electrique&facet=consigne_a_casques_gratuite&facet=lavage_voitures_et_ou_motos&facet=horaire_vl_15mn_15_min&facet=horaire_vl_3h00_3_hr&facet=horaire_moto_15mn_15_min&facet=zones_res')
    .then(res => res.json())
    .then(json => {

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiaGlucW8iLCJhIjoiY2wzazVzcTFpMTlndTNjcXc2eWliZXNtbCJ9.zizW-hZ-8RKAvCcVwnDtDg'
        }).addTo(map);

        for (let i = 0; i < json["parameters"]["rows"]; i++) {
            let nom_parking = json["records"][i]["fields"]["nom_parking"];
            let geo = json["records"][i]["fields"]["geo"];
            let ville = json["records"][i]["fields"]["ville"];
            let cp = json["records"][i]["fields"]["code_postal"];
            let type = json["records"][i]["fields"]["type_de_parc"];
            let adresse = json["records"][i]["fields"]["adresse_principale_d_acces_vehicules"];
            let site = json["records"][i]["fields"]["lien_web_parking"];
            let pmoto15 = json["records"][i]["fields"]["horaire_moto_15mn_15_min"];
            let pvl1 = json["records"][i]["fields"]["horaire_vl_1h00_1_hr"];
            let video = json["records"][i]["fields"]["video_surveillance"];
            let pmr = json["records"][i]["fields"]["accessibilite_pmr"];
            let habo = json["records"][i]["fields"]["horaires_d_acces_aux_abonnes"];
            let hnabo = json["records"][i]["fields"]["horaires_d_acces_au_public_pour_les_usagers_non_abonnes"];
        
            

            tab.push({
            "nom_parking": nom_parking,
            "geo": geo,
            "ville": ville,
            "cp": cp,
            "type": type,
            "adresse": adresse,
            "site": site,
            "pmoto15": pmoto15,
            "pvl1": pvl1,
            "video": video,
            "pmr": pmr,
            "habo": habo,
            "hnabo": hnabo
            });
        }

        
        function gmap(geo, adresse, nom, cp, ville) {
            nom.replace('','+');
            adresse.replace('','+');
            base = "https://www.google.com/maps/dir//"+ nom + ",+" + adresse + ",+" + cp + "+" + ville + "/@" + geo.join();
            return base;
        }

        const myIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        function createmodalplus(type,video){
            let div = document.createElement("div");
            div.className = 'modal-content';
            div.id = 'modalplus-content';
            div.innerHTML = "<span id='close'>&times;</span>"
            + "<span id = 'type'> Type de parking : " + type[0].toUpperCase() + type.slice(1) + "</span> <br>"
            + "<span id = 'video'> Vidéosurveillance : " + video[0].toUpperCase() + video.slice(1) + "</span> <br>"
            ;

            var modalplus = document.getElementById('modalplus');

            modalplus.appendChild(div); //add div
            modalplus.style.display = "block"; //show modal

            // close modal
            $(document).on("click","#close",function(){
                modalplus.style.display = "none";
                });
            
            window.onclick = function(event) {
                if (event.target == modalplus) {
                    modalplus.style.display = "none";
                }
            }
        }


        for (let i = 0; i < tab.length; i++) {
             L.marker(tab[i]["geo"], {icon: myIcon}).addTo(map)
             .bindPopup(
                "<div class = 'infos'>"
                        + "<span class = 'nomparking'>" + tab[i]["nom_parking"].toUpperCase() + "</span> <br>"
                        + "<span class = 'adresse'>" + tab[i]["adresse"][0].toUpperCase() + tab[i]["adresse"].slice(1) +
                        "<br> " + tab[i]["cp"] + " " + tab[i]["ville"] + "</span> <br>"
                + "</div>"

                + "<div id='bas'> "
                    + "<div class = 'liens'>"
                            + "<a href='" + tab[i]["site"] + "'> <button id='site'> <img src='https://img.icons8.com/material/24/ffffff/external-link--v1.png-'/> <span> Site web </span> </button> </a>"
                            + "<a href='" + gmap(tab[i]["geo"],tab[i]["adresse"],tab[i]["nom_parking"],tab[i]["cp"],tab[i]["ville"]) +
                            "' target='_blank'> <button id='itin'> <img src='https://img.icons8.com/material/24/ffffff/itinerary--v1.png'/> <span> Itinéraire </span> </button>  </a>"
                            + "<button id='plus' onclick = 'createmodal("
                            + tab[i]["type"] + "," + tab[i]["video"]
                            +")'> <img src='https://img.icons8.com/material/24/ffffff/more--v1.png'/> </button>"
                    + "</div>" 

                    + "<div class = 'res'>"
                            +"<button > <img src='https://img.icons8.com/material/24/ffffff/car--v1.png'/> <span> Réservation Voiture </span> </button>"
                            +"<button id='btnresmot'> <img src='https://img.icons8.com/material/24/ffffff/scooter--v1.png'/> <span> Réservation Moto </span> </button>"
                    +"</div>"
                +"</div>"
                 );  
        }
        
        console.log(tab)

    });
