import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { categoriaService } from '../services/categoria.service';

export const categoriaController = {
    listar : async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categorias = await categoriaService.listar();

            return res.status(StatusCodes.OK).json({
                success: true,
                data: categorias,
            });
        }
        catch (error) {
            console.log("Error en categoriaController.listar:", error); 
            next(error);
        }
    }
}

