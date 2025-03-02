import Company from './company.model.js';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const x1 = require('excel4node');

export const addCompany = async (req, res) => {
    try {
        
        const data = req.body;

        const actualYear = new Date().getFullYear();
        const trajectory = actualYear - data.yearFoundation;

        if(data.yearFoundation > actualYear){
            return res.status(400).json({
                success: false,
                msg: 'El año de fundación no puede ser mayor al año actual.'
            })
        }

        const company = new Company({
            name: data.name,
            description: data.description,
            impactLevel: data.impactLevel,
            yearFoundation: data.yearFoundation,
            trajectory: trajectory,
            category: data.category,
            contact: data.contact
        })

        await company.save();

        res.status(200).json({
            success: true,
            msg: 'Empresa agregada exitosamente.',
            company,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'La empresa no se pudo agregar.',
            error: error.message
        })
    }
}

export const getCompanies = async (req, res) => {
    try {

        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, companies] = await Promise.all([
            Company.countDocuments(query),
            Company.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        /*const companies = await Company.find({ status: true });

        companies.sort((a, b) => a.name.localeCompare(b.name))*/

        res.status(200).json({
            success: true,
            total,
            companies

        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudieron obtener las empresas.',
            error: error.message
        })
    }
}

export const getCompaniesA_Z = async (req, res) => {
    try {
        
        const companies = await Company.find({ status: true });

        companies.sort((a, b) => a.name.localeCompare(b.name));

        res.status(200).json({
            success: true,
            companies
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudieron obtener las empresas.',
            error: error.message
        })
    }
}

export const getCompaniesZ_A = async (req, res) => {
    try {
        
        const companies = await Company.find({ status: true });

        companies.sort((a, b) => b.name.localeCompare(a.name));

        res.status(200).json({
            success: true,
            companies
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudieron obtener las empresas.',
            error: error.message
        })
    }
}

export const getTrajectoryMajor = async (req, res) => {
    try {

        const companies = await Company.find({ status: true });

        companies.sort((a, b) => b.trajectory - a.trajectory);

        res.status(200).json({
            success: true,
            companies
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudieron obtener las empresas.',
            error: error.message
        })
    }
}

export const getTrajectoryMinor = async (req, res) => {
    try {

        const companies = await Company.find({ status: true });

        companies.sort((a, b) => a.trajectory - b.trajectory);

        res.status(200).json({
            success: true,
            companies
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudieron obtener las empresas.',
            error: error.message
        })
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, yearFoundation, ...data } = req.body;

        const actualYear = new Date().getFullYear();

        if(yearFoundation){
            if(yearFoundation > actualYear){
                return res.status(400).json({
                    success: false,
                    msg: 'El año de fundación no puede ser mayor al año actual.'
                })
            }

            data.trajectory = actualYear - yearFoundation;
            data.yearFoundation = yearFoundation; 
        }

        const company = await Company.findByIdAndUpdate(id, data, { new: true });

        if(!company){
            return res.status(404).json({
                success: false,
                msg: 'Empresa no encontrada.'
            })
        }

        res.status(200).json({
            success: true,
            msg: 'Empresa actualizada.',
            company
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'La empresa no se pudo actualizar.',
            error: error.message
        })
    }
}

/*export const deleteCompany = async (req, res) => {

    const { id } = req.params;

    try {
        
        await Company.findByIdAndUpdate(id, { status: false });
        
        res.status(200).json({
            success: true,
            msg: 'La empresa se ha desactivado.',
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'La empresa no se ha podido desactivar.',
            error: error.message
        })
    }
}*/

export const generarReporte = async (req, res) => {
    try {
        
        const companies = await Company.find();

        if(companies.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontraron empresas.'
            })
        }
        
        const wb = new x1.Workbook(); // Crea un nuevo libro de excel
        const ws = wb.addWorksheet('Empresas'); // Crea una hoja

        const headerStyle = wb.createStyle({ // Define el estilo de celda
            font: {
                name: 'Arial',
                color: '#000000',
                size: 12,
                bold: true
            }
        })

        const contentStyle = wb.createStyle({
            font: {
                name: 'Arial',
                color: '#000000',
                size: 10,
            }
        })

        ws.cell(1, 1).string('Nombre').style(headerStyle); // Agrega los encabezados a la hoja
        ws.cell(1, 2).string('Descripción').style(headerStyle);
        ws.cell(1, 3).string('Nivel de Impacto').style(headerStyle);
        ws.cell(1, 4).string('Año de Fundación').style(headerStyle);
        ws.cell(1, 5).string('Trayectoria').style(headerStyle);
        ws.cell(1, 6).string('Categoría').style(headerStyle);
        ws.cell(1, 7).string('Contacto').style(headerStyle);
        ws.cell(1, 8).string('Estado').style(headerStyle);

        let row = 2;
        companies.forEach(company => { // Recorre todo el array de empresas y las agrega a la hoja
            ws.cell(row, 1).string(company.name).style(contentStyle); // Agrega los datos de la empresa a la hoja
            ws.cell(row, 2).string(company.description).style(contentStyle);
            ws.cell(row, 3).string(company.impactLevel).style(contentStyle);
            ws.cell(row, 4).number(company.yearFoundation).style(contentStyle);
            ws.cell(row, 5).string(company.trajectory + ' Años').style(contentStyle);
            ws.cell(row, 6).string(company.category).style(contentStyle);
            ws.cell(row, 7).string(company.contact).style(contentStyle);
            ws.cell(row, 8).string(company.status.toString()).style(contentStyle);
            row = row + 1;
        })

        const reportsDir = path.join(__dirname, '..', 'reports'); // Ruta de la carpeta donde se va a guardar el archivo
        if(!fs.existsSync(reportsDir)){
            fs.mkdirSync(reportsDir); // Crea la carpeta si no existe
        }

        const pathExcel = path.join(reportsDir, 'Empresas.xlsx'); // Define la ruta donde se va a guardar el archivo

        wb.write(pathExcel, (err, stats) => {
            if(err) {
                return res.status(500).json({
                    success: false,
                    msg: 'No se pudo generar el reporte.',
                    error: err.message
                })
            } else {
                res.download(pathExcel);
                return res.status(200).json({
                    success: true,
                    msg: 'Reporte generado.'
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo generar el reporte.',
            error: error.message
        })
    }
}