
import React, { useState } from "react";
import { Button, Modal } from "antd";

import './about.css';

export default function About (){
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    return (
    <>
        <Button className='buttonAbout' type="default" onClick={showModal}>
            About
        </Button>
        <Modal 
            className="class-Modal-About"
            wrapClassName="Modal-About"
            title="Informationen zur Webapplikation" 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleCancel}
            maskClosable={false}
            centered={true}
            >
                <p> 
                    Die hier zusehende Webapplikation ist im Rahmen eines dreimonatigen Praktikums 
                    bei 'terrestris GmbH & Co. KG' (https://www.terrestris.de/) entstanden und verwendet ausschließlich Open Source Daten aus verschiedenen
                    Quellen. 
                </p> 

                <p> 
                    Ziel der Webapplikation ist die Bereitstellung von Informationen in Bezug auf die
                    Schadstoff- und Lärmbelastung in Deutschland sowie die Sensibilisierung für die Problematik.
                    Übergeordnetes methodisches Ziel war das Kennenlernen und Anwenden
                    der verschiedenen Schritte bei der Entwicklung einer Webapplikation. 
                </p> 

                <p>
                    Die Webapplikation bietet die Möglichkeit sich die mittlere jährliche Belastung verschiedener Schadstoffe für das Jahr 2021
                    an unterschiedlichen Standorten in Deutschland anzuschauen und Verläufe der letzten Jahre zu betrachten. Bei 
                    der Standortsuche kann die Suchleiste behilflich sein. Außerdem wird die Lärmbelastung durch Hauptlärmquellen
                    dargestellt und verschiedene Informationen zu der Einwohnerdichte pro Gemeinde, den Standorten von Krankenhäusern sowie der 
                    durchschnittliche Reisedauerentfernung zum nächstliegenden Krankenhaus zur Verfügung gestellt. 
                </p> 

                <p>
                    Laut der Europäischen Umweltagentur ist jeder zehnte vorzeitige Todesfall in der EU auf
                    die Verschmutzung der Umwelt zurückzuführen. Außerdem leiden zahlreiche Bürger an Krankenheiten wie Atem-
                    wegs- und Herz-Kreislauf-Erkrankungen, die ebenfalls durch Luftverschmutzung hervorgerufen werden können. 
                    Betroffen sind vor allem Menschen mit vorgeschädigten Atemwegen, Kinder und Personen in fortgeschrittenem
                    Alter. 
                    Trotz zahlreicher Maßnahmen und einem tendenziellen Rückgang der Schadstoffbelastung
                    sind die Grenz- und Zielwerte, bei denen gesundheitliche Wirkungen ausgeschlossen werden,
                    noch nicht erreicht. 
                    In Bezug auf die Lärmbelästigung kann eine dauerhafte Belastung zur Beeinträchtigung des körperlichen, 
                    seelischen und sozialen Wohlbefinden des Menschens führen und stört einen erholsamen Schlaf.
                    Dies kann Auswirkungen auf Stress und Nervosität haben, die ebenso zu Risikofaktoren für
                    Herz-Kreislauferkrankungen zählen. (BAFU, EEA, LfU Bayern, UBA)
                </p> 

                <p>
                    Aufgrund der potentiellen gesundheitlichen Auswirkungen für den menschlichen Körper, ist das Messen und 
                    und Überwachen von Schadstoff-Belastungen essentiell und in unserem aller Interesse. 

                    Neben politischen Maßnahmen kann jeder von uns versuchen einen Beitrag zur Reduzierung 
                    der Luftverschmutzung zu leisten.
                    Wichtigste Anknüpfungspunkte sind dabei due Themen Verkehr, Ernährung und Konsum. 
                    - Wo können wir die Nutzung des Autos durch andere Verkehrsmittel wie das Rad, 
                    den öffentlichen Nahverkehr oder zu Fuß ersetzen? 
                    - Ist die Reise mit dem Flugzeug wirklich notwendig oder gibt es 
                    vielleicht auch ein anderes Reiseziel, das mich interessiert und wo 
                    ich mit anderen Verkehrsmitteln hinkomme? 
                    - Und wie ernähre ich mich? Kann ich zum Beispiel Transportwege vermindern, 
                    indem ich regionaler und/oder saisonaler einkaufe? Oder gibt es die Gurke vielleicht auch 
                    ohne Plastikverpackung? 
                    - Brauche ich immer das neuste technische Gerät? Oder funktioniert vielleicht
                    mein altes Smartphone auch noch einwandfrei? 
                    Es ist schwierig, wenn nicht sogar unmöglich, in allen Bereichen des Lebens 
                    die Emission von Schadstoffen zu reduzieren oder gar zu unterbinden. Dennoch
                    ist es relevant, dass wir die entstehenden Emissionen und Auswirkunen bewusst in unsere alltäglichen 
                    Entscheidungen berücksichtigen. 
                </p> 

                <p>
                    Ausgangspunkt des Projekts war eine weiße, leere Website, die nach und nach mit Daten, Informationen und Features gefüllt 
                    wurde. Dabei wurden Daten von verschiedenen Quellen verwendet, in QGIS aufbereitet und mithilfe des GeoServers für die Webapplikation 
                    bereit gestellt. Nach und nach kamen Features, wie der Ebenenbaum, die Suchleiste, die FeatureInfo-Abfrage inklusive der Graphen und weitere Werkzeuge hinzu. 
                    Die Webapplikation kann zum jetzigen Zeitpunkt keinesfalls als abgeschlossen angesehen werden, 
                    sondern könnte theoretisch stetig mit weiteren Daten (wie z.B. den Standorten von Kindergärten, Altenheimen, o.ä.) 
                    und Features ergänzt werden. 

                 </p>

                 <p>
                    Hinweis zu den Daten: 
                    In Bezug auf die Rasterdaten ist daraufhinzuweisen, dass diese auf die Nationalgrenzen von Deutschland
                    zugeschnitten wurden und es aus diesem Grund in Randbereichen zu fehlenden Werten und Lücken kommen kann.
                    Die flächendeckenden Daten zur Verteilung der Schadstoffbelastung in Deutschland sind interpoliert, weshalb
                    es in der Realität zu kleinräumigen Abweichungen innerhalb der Rasterzellen kommen kann. Außerdem standen nur für die 
                     Schadstoffe Stickstoffoxide (NOx), Stickstoffdioxid (NO2), Feinstaub (PM10) und Feinstaub (PM2.5) jährliche Mittelwerte zur Verfügung. 
                    Für die verschiedenen Messstationen gilt, dass die angegebenen Werte für diese bestimmte geographische Position gelte und 
                    es kleinräumig je nach Lage zu Abweichungen kommen kann. Außerdem können sich die Werte für die Schadstoffbelastung 
                    zwischen den Raster- und Vektordaten leicht unterscheiden, da die Rasterdaten eine Interpolation an Werten 
                    darstellen. 

                 </p>

                 <p>
                    Für weitere Informationen: <br></br>
                  <i> AOK:</i>  https://www.aok.de/pk/magazin/nachhaltigkeit/wasser-luft/das-koennen-sie-gegen-luftverschmutzung-tun/ <br></br>
                  <i>  BAFU: </i>  https://www.bafu.admin.ch/bafu/de/home/themen/luft/fachinformationen/auswirkungen-der-luftverschmutzung/auswirkungen-der-luftverschmutzung-auf-die-gesundheit.html<br></br>
                  <i> EEA: </i>  EEA https://www.eea.europa.eu/de<br></br>
                  <i> LfU Bayern: </i>  https://www.lfu.bayern.de/laerm/laerm_allgemein/wirkung_auf_menschen/index.html<br></br>
                  <i> UBA: </i>  https://www.umweltbundesamt.de/themen/luft/wirkungen-von-luftschadstoffen/wirkungen-auf-die-gesundheit#woher-stammen-die-schadstoffe-und-wie-wirken-sie-sich-auf-die-gesundheit-aus<br></br>
                 </p>
                
        </Modal>
    </>
    );
};


