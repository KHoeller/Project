
// SliderCode - Slider für einzelne groups, die man mit Checkbox an und ausschalten kann und mit verschieben des pucks auch zwischen den Layern/Jahren switchen kann
    // erst bei Verschieben des Reglers werden die Layer geladen, deswegen bei erstem Verschieben zwischendurch 'weiß'


import React, { useState, useEffect } from 'react';
import { Slider } from 'antd';
import { Layer } from '../../../types/types';

export type SliderProps = {
    group: Layer[];
    groupName: string;
    checked: boolean;
    initialValue: number | null; 
    onIndexChange: any;
}

export default function RasterSlider({ group, groupName, checked, initialValue, onIndexChange }: SliderProps) {
    
    
    const [inputValue, setInputValue] = useState<number | null>(initialValue);             
    const [previousIndex, setPreviousIndex] = useState<number | null>(0);

    //// mit diesem UseEffect kann man sich in der Console ausgeben lassen, wann die function gerendert wird (oder ob sie immer nur updated wird)
        // useEffect(() => {
        //     console.log('mount');

        //     return () => {
        //         console.log('unmount')
        //     };
        // }, []);
    ////
    
    useEffect(() => {
        if (checked) {
            if(initialValue !== undefined){
                setInputValue(initialValue);

            } else {
            const initialIndex = group.findIndex(layer => layer.year === 2021); // Finde Index des Jahres 2021
            
            setInputValue(previousIndex !== null ? previousIndex : initialIndex); // sofern es einen previousIndex gibt wird dieser verwendet 
            }
        }
    }, [group, checked]);

    
    useEffect(() => {
        if (checked) {
            
            group.forEach((layer, index) => {
                if (index === inputValue) {
                    layer.layer.setVisible(true);
                } else {
                    layer.layer.setVisible(false);
                    
                }
            });
        } else {
            group.forEach(layer => layer.layer.setVisible(false));          
            if (inputValue !== null) {
                setPreviousIndex(inputValue); // der zuletzt angezeigt Index wird gespeichert 
            }
        }
    }, [checked, group, inputValue, groupName, previousIndex]);
       
    
    const handleChange = (newValue: number) => {
        if (checked && newValue !== inputValue) {
            setInputValue(newValue); // inputvalue wird nur aktualisiert, wenn ein neuer Index 
            onIndexChange(newValue);
        }
    };

    const years = group.map(layer => layer.year);
   
    const marks: { [key: number]: React.ReactNode } = years.reduce<{ [key: number]: React.ReactNode }>((acc, year, index) => {
        const shortYear = year?.toString().slice(-2);
        acc[index] = (
            <span>
                <sup>'</sup>
                {shortYear}
                
            </span>
        );
        return acc;
    }, {});

    const minYear = years.length > 0 ? years[0] : 0;
    const maxYear = years.length > 0 ? years[years.length - 1] : 0;

    return (
        <div>
            <h4 style={{ fontWeight: 'normal' }}> Jahresmittelwerte (µg/m3) {groupName} von {minYear} bis {maxYear} </h4>
            <Slider
                value={inputValue !== null ? inputValue : 0}
                onChange={handleChange}
                included={false}
                min={0}
                max={years.length - 1}
                marks={marks}
               
                style={{ width: '250px'}}/>
                
        </div>
    );
}


// fontWeight: normal -> normal, nicht dick oder kursiv 


    