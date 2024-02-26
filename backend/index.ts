import { Server, ic } from 'azle';
import cors from "cors";
import express from 'express';

type TPaints = {
    id:number;
    Color:string;
    Liters:number;
    finished:string;
    Interior_or_exterior:string;

}

let paints: TPaints[] = [
{
    id:1,
    Color:"Rojo",
    Liters:5,
    finished:"Mate",
    Interior_or_exterior:"Interior",

}

]

export default Server(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // app.use((req, res, next) => {
    //     if (ic.caller().isAnonymous()) {
    //         res.status(401);
    //         res.send();
    //     } else {
    //         next();
    //     }
    // });

    app.post('/create',(req, res)=>{
        const paint=paints.find((paint)=>paint.id === parseInt(req.body.id));
        if(paint){
            res.status(400).json({msg:"El id esta ocupado", data:paint});
            return;
        }
        req.body.id = paints[paints.length - 1].id+1;
        paints.push(req.body); 
        res.status(200).json({msg:"Pintura añadida al inventario"});
    });

    app.get('/get',(req,res)=>{
        res.status(200).json({msg:"Pinturas obtenidas con exito", data:paints});
    })

    app.put('/update/:id',(req, res)=>{
        const paint = paints.find((paint)=>paint.id === parseInt (req.params.id));
        if(!paint){
            res.status(400).json({msg:"El ID a actualizar no existe"});
            return;
        }
        
        const UPaint = {paint, ...req.body};

        paints = paints.map((p) => p.id === UPaint.id ? UPaint : p);

        res.status(200).json({msg:"La pintura se actualizo con exitos"});
    });

    app.delete("/delete/:id",(req, res)=>{
        paints = paints.filter((p) => p.id !== parseInt(req.params.id));

        res.status(200).json({msg:"Las pinturas se eliminaron con exito", data:paints});   
    })


    app.post('/test', (req, res) => {
        res.json(req.body);
    });

    app.get('/whoami', (req, res) => {
        res.statusCode = 200;
        res.send(ic.caller());
    });

    app.get('/health', (req, res) => {
        res.send().statusCode = 204;
    });

    return app.listen();
});
