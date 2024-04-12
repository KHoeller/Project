
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
            wrapClassName="Modal-About"
            title="About the Project" 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleCancel}
            maskClosable={false}
            centered={true}
            >
                <p> Die hier zusehende Webapplikation ist im Rahmen eines dreimonatigen Praktikums 
                    bei 'terrestris GmbH & Co. KG' (https://www.terrestris.de/de/) entstanden und verwendet ausschließlich Open Source Daten aus verschiedenen
                    Quellen. Aufgrund der zeitlichen Begrenzung kann es gegebenenfalls zu Fehlern in der Anwendung kommen
                    und es konnte nur eine begrenzte Zahl an Features programmiert werden. 

                    Übergeordnetes methodisches Ziel war das Kennenlernen und Nachvollziehen 
                    der Schritte bei der Programmierung einer Webapplikation mit dem inhaltlichen Ziel Informationen zur 
                    Schadstoff- und Lärmbelastung sowie den Zugang zu Gesundheitseinrichtungen in Deutschland darzustellen 
                    und für die Problematik und alltägliche Konfrontation zu sensibilisieren.

                    Die Webapplikation bietet die Möglichkeit sich die mittlere jährliche Belastung () verschiedener Schadstoffe für das Jahr 2021
                    an unterschiedlichen Standorten in Deutschland anzuschauen und Verläufe der letzten Jahre zu betrachten. Bei 
                    der Standortsuche kann unter anderem auch die Suchleiste behilflich sein. Außerdem kann die Lärmbelastung 
                    betrachtet werden und verschiedene Informationen zu der Einwohnerdichte pro Gemeinde, den Standorten von Krankenhäusern sowie der 
                    durchschnittliche Reisedauerentfernung abgerufen werden. 

                    Laut der Europäischen Umweltagentur ist jeder zehnte vorzeitige Todesfall in der EU auf
                    die Verschmutzung der Umwelt zurückzuführen. Auch leiden zahlreiche Bürger an Krankenheiten wie Atem-
                    wegs- und Herz-Kreislauf-Erkrankungen, die um auf Umweltverschmutzung zurückzuführen sind. (EEA https://www.eea.europa.eu/de)
                    Mit jedem Atemzug gelangen Gase und kleinste Partikel in unsere Bronchien und Lungen und dringen in unseren Körper ein. 
                    In der Folge leiden viele Bürger*innen an Atemwegs- und HErz-Kreislauferkrankungen, die die Lebenserwartung reduzieren.
                    (https://www.bafu.admin.ch/bafu/de/home/themen/luft/fachinformationen/auswirkungen-der-luftverschmutzung/auswirkungen-der-luftverschmutzung-auf-die-gesundheit.html)  
                    Trotz zahlreicher Maßnahmen und einem tendenziellen Rückgang der Schadstoffbelastung
                    sind die Grenz- und Zielwerte, bei denen gesundheitliche Wirkungen ausgeschlossen werden 
                    noch nicht erreicht. (https://www.umweltbundesamt.de/themen/luft/wirkungen-von-luftschadstoffen/wirkungen-auf-die-gesundheit#woher-stammen-die-schadstoffe-und-wie-wirken-sie-sich-auf-die-gesundheit-aus)
                    Außerdem führt eine dauerhafte Lärmbelastung zur Beeinträchtigung des körperlichen, 
                    seelischen und sozialen Wohlbefinden des Menschens, stört einen erholsamen Schlaf
                    und kann Auswirkungen auf Stress und Nervosität haben, die zu Risikofaktoren für
                    Herz-Kreislauferkrankungen zählen. (https://www.lfu.bayern.de/laerm/laerm_allgemein/wirkung_auf_menschen/index.html)

                    Die Europäische Umweltagentur berichtet, dass Umweltverschmutzung für jeden zehnten vorzeitigen Todesfall in der EU verantwortlich ist. 
                    Sie führt zu einer Vielzahl von Krankheiten wie Atemwegs- und Herz-Kreislauf-Erkrankungen. 
                    Trotz Maßnahmen zur Reduzierung der Schadstoffbelastung bleiben die Grenzwerte für gesundheitliche Sicherheit unerreicht. 
                    Zusätzlich beeinträchtigt anhaltender Lärm das körperliche und seelische Wohlbefinden, stört den Schlaf und erhöht das Risiko für Herz-Kreislauf-Erkrankungen.

                    Ausgangspunkt war eine weiße, leere Website, die nach und nach mit Daten, Informationen und Features gefüllt 
                    wurde. 

                    Die Webapplikation kann keinesfalls 
                    als abgeschlossen angesehen werden, sondern könnte theoretisch stetig 
                    mit weiteren Daten (wie den Standorten von Kindergärten o.ä.) und weiteren Features ergänzt werden. 

                    Hinweis zu den Daten: 
                    In Bezug auf die Rasterdaten ist daraufhinzuweisen, dass diese auf die Nationalgrenzen von Deutschland
                    zugeschnitten wurden und es aus diesem Grund in Randbereichen zu fehlenden Werten und Lücken kommen kann.
                    Die flächendeckenden Daten zur Verteilung der Schadstoffbelastung in Deutschland sind interpoliert, weshalb
                    es zu kleinräumigen Abweichungen innerhalb der Rasterzellen kommen kann. Außerdem standen nur für die 
                    vier Schadstoffe NO2, NOx, PM10, PM2.5 jährliche Mittelwerte zur Verfügung. Ebenso gelten die Schadstoffbe-
                    lastungen an den verschiedenen Messstationen vor allem für diese bestimmte geographische Position und 
                    es kann kleinräumig je nach Lage zu Abweichungen kommen. Die ausgegebenen Werte für die schadstoffbelastung 
                    kann zwischen den Raster- und Vectordaten leicht abweichen, da die Rasterdaten eine Interpolation an Werten 
                    darstellen. </p>
                {/* <p>Some contents...</p>
                <p>Some contents...</p> */}
        </Modal>
    </>
    );
};


