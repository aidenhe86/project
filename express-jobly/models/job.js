"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, ExpressError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job{
    // Create a job from data, update db, return new job data
    // data should be { title, salary, equity, companyHandle }
    // return { title, salary, equity, company_handle }

    // Throw bad request company already have job database

    static async create({title, salary, equity, companyHandle}){
        const duplicateCheck = await db.query(
            `SELECT title, company_handle 
            FROM jobs AS j 
            JOIN companies AS c 
            ON c.handle = j.company_handle
            WHERE title = $1 AND company_handle = $2`,
            [title,companyHandle]);
        
        if (duplicateCheck.rows[0]) throw new BadRequestError(`
            Duplicate title:${title} for Company:${companyHandle}`);

        const result = await db.query(`
            INSERT INTO jobs 
            (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,[title, salary, equity, companyHandle]);
        return result.rows[0]
    }

    // Find all jobs with search filter.
    static async findAll(searchFilter = {}){
        let query = 
        `SELECT id, 
                title, 
                salary, 
                equity, 
                company_handle AS "companyHandle"
        FROM jobs`;

        let filterQuery = [];
        let queryValues = [];

        const {title, minSalary,hasEquity} = searchFilter;

        // if query have title
        if(title !== undefined){
            queryValues.push(title);
            filterQuery.push(`title ILIKE $${queryValues.length}`);
        }

        // if query have minSalary
        if(minSalary !== undefined){
            queryValues.push(minSalary);
            filterQuery.push(`salary >= $${queryValues.length}`);
        }

        // if query have hasEquity
        if(hasEquity === true){
            filterQuery.push(`equity > 0`);
        }

        // add filter query to original query
        if(filterQuery.length !== 0){
            query += " WHERE " + filterQuery.join(" AND ")
        }
        query += " ORDER BY title";

        const jobRes = await db.query(query,queryValues);
        return jobRes.rows;
    }

    static async get(id){
        let jobRes = await db.query(
            `SELECT id, 
                    title, 
                    salary,
                    equity,
                    company_handle AS "companyHandle"
            FROM jobs
            WHERE id = $1`,[id]);
        const job = jobRes.rows[0];
        if(!job) throw new NotFoundError(`No Job ID:${id}`);
        return job
    }

    static async update(id,data){
        const {setCols, values} = sqlForPartialUpdate(
            data,
            {companyHandle : "company_handle"}
            );
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs 
                            SET ${setCols}
                            WHERE id = ${idVarIdx}
                            RETURNING id, 
                                    title,
                                    salary,
                                    equity,
                                    company_handle AS "companyHandle"`;
        const result = await db.query(querySql,[...values, id])
        const job = result.rows[0];
        if(!job) throw new NotFoundError(`No JOB ID:${id}`);
        return job;
    }

    static async remove(id){
        const result = await db.query(
            `DELETE
            FROM jobs
            WHERE id = $1
            RETURNING id`,[id]);
        const job = result.rows[0];
        if(!job) throw new NotFoundError(`No JOB ID:${id}`);
    }
}


module.exports = Job;