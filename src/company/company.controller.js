import Company from './company.model.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const x1 = require('excel4node');

export const addCompany = async (req, res) => {
    try {
        
        const data = req.body;

        const actualYear = new Date().getFullYear();
        const yearsExperience = actualYear - data.yearFoundation;

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
            category: data.category,
            contact: data.contact
        })

        await company.save();

        res.status(200).json({
            success: true,
            msg: 'Empresa agregada exitosamente.',
            company,
            yearsExperience
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

        const companies = await Company.find();

        if(companies.length === 0){
            return res.status(404).json({
                success: false,
                msg: 'No se encontraron empresas.'
            })
        }

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
        const ws = wb.addWorksheet('Empresas');

        const headerStyle = wb.createStyle({ // Crea el estilo de celda
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

        ws.cell(1, 1).string('Nombre').style(headerStyle);
        ws.cell(1, 2).string('Descripción').style(headerStyle);
        ws.cell(1, 3).string('Nivel de Impacto').style(headerStyle);
        ws.cell(1, 4).string('Año de Fundación').style(headerStyle);
        ws.cell(1, 5).string('Categoría').style(headerStyle);
        ws.cell(1, 6).string('Contacto').style(headerStyle);


        let row = 2;
        companies.forEach(company => {
            ws.cell(row, 1).string(company.name).style(contentStyle);
            ws.cell(row, 2).string(company.description).style(contentStyle);
            ws.cell(row, 3).string(company.impactLevel).style(contentStyle);
            ws.cell(row, 4).number(company.yearFoundation).style(contentStyle);
            ws.cell(row, 5).string(company.category).style(contentStyle);
            ws.cell(row, 6).string(company.contact).style(contentStyle);
            row = row + 1;
        })

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); // Configurar la respuesta HTTP para la descarga
        res.setHeader("Content-Disposition", "attachment; filename=empresas.xlsx");

        wb.write('Empresas.xlsx', res);

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'No se pudo generar el reporte.',
            error: error.message
        })
    }
}