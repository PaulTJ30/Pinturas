"use client";
import { useEffect, useState } from 'react';

import axios from 'axios';
import { useSelectedLayoutSegment } from 'next/navigation';
import { isDeepStrictEqual } from 'util';
import { Bellota_Text } from 'next/font/google';

type TPaints = {
    id?: number;
    Color:string;
    Liters:number;
    finished:string;
    Interior_or_exterior:string;

}

type TRes = {
    msg:string;
    data?:any 
}



const headers =  {
    headers: {
        "Content-Type": "application/json",
    }
}

export default function CrudPaintsPage() {
    useEffect(() => {
        getPaints();
    }, []);

    const [paints, setPaints] = useState<TPaints[]>([]);
    const [paint, setPaint] = useState<TPaints> ({
    Color:"",
    Liters:0,
    finished:"",
    Interior_or_exterior:"",
    });

    const[isEditable, setIsEditable] = useState(false);

    const onChange = (p: any) => {
        const data: any = paint;
        data[p.target.name] = p.target.value;
        setPaint(data);
    }


    const getPaints = async () => {
        try {
           
            const response = await axios.get<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/get`);

            if(response.data.data){
                setPaints(response.data.data);

            }
        } catch (error) {
            alert("Hubo un error al realizar la peticion ${error}");
        }
    } 

    const creatPaints = async () =>{
        try {
         
           await axios.post<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/create`,paint,headers);
            getPaints();
        } catch (error) {
            alert("Hubo un error al realizar la peticion ${error}");
        }
    }
    const updatePaint = async (id:number) =>{
        try {

            await axios.put<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/update/${id}`,
                paint, 
                headers
            );
            getPaints();
            setIsEditable(false); 
        } catch (error) {
            alert(`Hubo un error al realizar la peticion ${error}`);
        }
    }

    const deletePaint = async (id:number) =>{
        try {
            await axios.delete<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/delete/${id}`
            );
            getPaints();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion ${error}`);
        }
    }

    const preUpdate =(p:TPaints) => {
        setPaint(p);
        setIsEditable(true);
    }
    return (
        <div>
            <h1>Crud de Pinturas</h1>
            <div>
                <label htmlFor="Color">Ingresa el color de la pintura:</label><br/>
                 <input
                    type="text"
                    onChange={(p) => onChange(p)}
                    name='Color'
                    placeholder='Color'
                /><br/>
                 <label htmlFor="finished">Ingresa el acabado de la pintura:</label><br/>
                 <input
                    type="text"
                    onChange={(p) => onChange(p)}
                    name='finished'
                    placeholder='Acabado'

                /><br/>
                 <label htmlFor="liters">Ingresa los litros de la pintura:</label><br/>
                 <input
                    type="number"
                    onChange={(p) => onChange(p)}
                    name='Liters'
                    placeholder='Litros'

                /><br/>
                 <label htmlFor="in or ex">Ingresa exterior o interior:</label><br/>
                 <input
                    type="text"
                    onChange={(p) => onChange(p)}
                    name='Interior_or_exterior'
                    placeholder='Int o Ex'

                /><br/> 
            </div>
            <button onClick={creatPaints}>agregar pintura</button>
            <table>
                <tr>
                    <th>Color</th>
                    <th>Litros</th>
                    <th>Acabado</th>
                    <th>In o Ex</th>
                    <th>Opciones</th>

                </tr>
               {paints.map((paint, index)=>(
                    <tr key={index}>
                        <td>{paint.Color}</td>
                        <td>{paint.Liters}</td>
                        <td>{paint.finished}</td>
                        <td>{paint.Interior_or_exterior}</td>
                        <td>
                           <button onClick={()=> deletePaint(paint.id ?? 0)}>Delete</button>   
                        </td>
                        <td>
                           <button onClick={()=> preUpdate(paint)}>Update</button>   
                        </td>
                    </tr>
                ))}
            </table>
            {
                isEditable && (
                    <div>
                    <label htmlFor="Color">Ingresa el color de la pintura:</label><br/>
                     <input
                        type="text"
                        onChange={(p) => onChange(p)}
                        defaultValue={paint.Color}
                        name="Color"
                    /><br/>
                     <label htmlFor="finished">Ingresa el acabado de la pintura:</label><br/>
                     <input
                        type="text"
                        onChange={(p) => onChange(p)}
                        defaultValue={paint.finished}
                        name="finished"
                    /><br/>
                     <label htmlFor='liters'>Ingresa los litros de la pintura:</label><br/>
                     <input
                        type="number"
                        onChange={(p) => onChange(p)}
                        defaultValue={paint.Liters}
                        name="Liters"
                    /><br/>
                     <label htmlFor="in or ex">Ingresa exterior o interior:</label><br/>
                     <input
                        type="text"
                        onChange={(p) => onChange(p)}
                        defaultValue={paint.Interior_or_exterior}
                        name="Interior_or_exterior"
                    /><br/>
                    <button onClick={()=> updatePaint(paint.id ?? 0)}>Guardar</button>   
                </div>
                )
            }    
       </div>
    );
}
