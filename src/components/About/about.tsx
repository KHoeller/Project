
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
                    bei 'terrestris GmbH & Co. KG' (https://www.terrestris.de/) entstanden und verwendet Open Data verschiedener
                    Quellen auf dem Stand von Februar 2024. 
                </p> 

                <p> Ziel der Webapplikation: <br></br>
                    Das Ziel der Webapplikation ist die Bereitstellung von Informationen zur
                    Schadstoff- und Lärmbelastung in Deutschland sowie die Sensibilisierung für die Problematik und die potentiell damit einhergehenden Gesundheitsrisiken.
                    Übergeordnetes methodisches Ziel war das Kennenlernen und Anwenden
                    der verschiedenen Schritte bei der Entwicklung einer Webapplikation. 
                </p> 

                <p>
                    Die 'Umwelt-Gesundheitskarte für Deutschland' (UmweGK) bietet die Möglichkeit sich die mittlere jährliche Belastung verschiedener Schadstoffe für das Jahr 2021
                    an unterschiedlichen Standorten in Deutschland anzuschauen. Dabei können auch zeitliche Verläufe der Schadstoffbelastung der letzten Jahre betrachtet werden. Bei 
                    der Standortsuche kann die Suchleiste behilflich sein. Außerdem werden Daten zur Lärmbelastung durch Hauptlärmquellen, zur Landbedeckung, 
                    zur Einwohnerdichte pro Gemeinde, zu den Standorten von Krankenhäusern sowie zur 
                    durchschnittlichen Reisedauer zum nächstliegenden Krankenhaus zur Verfügung gestellt. Zu den verwendeten Daten gibt es kurze Informationstexte.  
                </p> 

                <p> Relevanz des Themas: <br></br>
                    Laut der Europäischen Umweltagentur ist jeder zehnte vorzeitige Todesfall in der EU auf
                    die Verschmutzung der Umwelt zurückzuführen. Außerdem leiden zahlreiche Bürger an Krankheiten wie Atemwegs- und Herz-Kreislauf-Erkrankungen, 
                    die ebenfalls durch Luftverschmutzung hervorgerufen werden können. 
                    Betroffen sind vor allem Kinder, Personen mit vorgeschädigten Atemwegen und Personen in fortgeschrittenem
                    Alter. 
                    Trotz zahlreicher Maßnahmen und einem tendenziellen Rückgang der Schadstoffbelastung
                    sind die Grenz- und Zielwerte, bei denen gesundheitliche Wirkungen ausgeschlossen werden,
                    noch nicht bei allen Schadstoffen erreicht. 
                    In Bezug auf die Lärmbelästigung kann eine dauerhafte Belastung zur Beeinträchtigung des körperlichen, 
                    seelischen und sozialen Wohlbefinden des Menschens führen und stört einen erholsamen Schlaf.
                    Dies kann Auswirkungen auf Stress und Nervosität haben, die ebenso zu Risikofaktoren für
                    Herz-Kreislauferkrankungen zählen. (BAFU, EEA, LfU Bayern, UBA)
                </p> 

                <p> Handlungsmöglichkeiten: <br></br>
                    Aufgrund der potentiellen gesundheitlichen Auswirkungen für den menschlichen Körper, ist das Messen 
                    und Überwachen der Schadstoffbelastung essentiell und in unserem aller Interesse. 

                    Neben politischen Maßnahmen kann jeder von uns durch alltägliche Entscheidungen einen Beitrag zur Reduzierung leisten. 
                    Wichtigste Anknüpfungspunkte sind dabei die Themen Verkehr, Ernährung und Konsum. Wir können zum Beispiel bewusst auf
                    die Nutzung des Autos verzichten und andere Verkehrsmittel nutzen, Fahrgemeinschaften bilden oder unsere Reisepläne überdenken.
                    Außerdem können wir uns für einen regionaleren und/oder saisonaleren Einkauf entscheiden und Plastikverpackungen wenn möglich vermeiden. 
                    Im Bereich Konsum sollten wir uns immer wieder die Frage stellen 'Brauchen wir das wirklich?'.
                    Es ist schwierig, wenn nicht sogar unmöglich, in allen Bereichen des Lebens gleichzeitig
                    die Emission von Schadstoffen zu reduzieren oder gar zu unterbinden. Dennoch
                    ist es relevant, dass wir die entstehenden Emissionen und Auswirkungen bewusst in unseren alltäglichen 
                    Entscheidungen berücksichtigen. 
                </p> 

                <p> Vorgehen bei der Entwicklung: <br></br>
                    Ausgangspunkt des Projekts war eine weiße, leere Website, die nach und nach mit Daten, Informationen und Features gefüllt 
                    wurde. Diese Daten stammten aus verschiedenen Quellen, wurden in QGIS aufbereitet und gestylt und mithilfe des GeoServers für die Webapplikation 
                    bereitgestellt. Für die Umsetzung wurden die JavaScript-Bibliothek 'OpenLayers' und die React-UI-Bibliothek 'Ant Design' verwendet.  
                    Nach und nach kamen Features, wie der Ebenenbaum, die Suchleiste, die Feature-Info-Abfrage inklusive der Graphen und weitere Werkzeuge hinzu. 
                    Die Webapplikation spiegelt den aktuellen Zustand am Ende des Praktikums (04/2024) wieder und könnte theoretisch
                    jederzeit mit weiteren Daten (wie z.B. den Standorten von Kindergärten, Altenheimen, o.ä.) 
                    und Features ergänzt werden. 

                 </p>
                
                 <p>Hinweis zu den Daten: <br></br>
                    In Bezug auf die Rasterdaten (Daten zur flächendeckenden Schadstoffbelastung) ist daraufhinzuweisen, dass diese auf die Nationalgrenzen von Deutschland
                    zugeschnitten wurden und es aus diesem Grund in Randbereichen zu fehlenden Werten und Lücken kommen kann.
                    Diese Daten sind zudem das Ergebnis einer Interpolation, weshalb
                    es in der Realität zu kleinräumigen Abweichungen innerhalb der Rasterzellen kommen kann und die Werte von den Ergebnissen der Messstationen (Vektordaten) abweichen können. 
                    Außerdem standen nur für die Schadstoffe Stickstoffoxide (NOx), Stickstoffdioxid (NO2), Feinstaub PM10 und Feinstaub PM2.5 flächendeckende jährliche Mittelwerte zur Verfügung. 
                    Für die verschiedenen Messstationen gilt, dass die angegebenen Werte für diese bestimmte geographische Position gelten. Abhängig von der Lage der Messstation  
                    kann es in der Realität kleinräumig zu abweichenden Werten kommen. 
                 </p>

                 <p>
                    Für weitere Informationen: <br></br>
                  <i > AOK:</i>  https://www.aok.de/pk/magazin/nachhaltigkeit/wasser-luft/das-koennen-sie-gegen-luftverschmutzung-tun/ <br></br>
                  <i>  BAFU: </i>  https://www.bafu.admin.ch/bafu/de/home/themen/luft/fachinformationen/auswirkungen-der-luftverschmutzung/auswirkungen-der-luftverschmutzung-auf-die-gesundheit.html<br></br>
                  <i> EEA: </i>  EEA https://www.eea.europa.eu/de<br></br>
                  <i> LfU Bayern: </i>  https://www.lfu.bayern.de/laerm/laerm_allgemein/wirkung_auf_menschen/index.html<br></br>
                  <i> UBA: </i>  https://www.umweltbundesamt.de/themen/luft/wirkungen-von-luftschadstoffen/wirkungen-auf-die-gesundheit#woher-stammen-die-schadstoffe-und-wie-wirken-sie-sich-auf-die-gesundheit-aus<br></br>
                 </p>
                
        </Modal>
    </>
    );
};


