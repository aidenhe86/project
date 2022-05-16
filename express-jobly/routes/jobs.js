"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const jobSearchSchema = require("../schemas/jobSearch.json");

const router = new express.Router();

// POST a new job
router.post("/", ensureAdmin, async function(req,res,next){
    try{
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }

        const job = await Job.create(req.body);
        return res.status(201).json({job})
    }catch(e){
        return next(e)
    }
})

// GET all jobs
router.get("/", async function(req,res,next){
    try{
        const q = req.query;
        if(q.minSalary !== undefined) q.minSalary = +q.minSalary;
        q.hasEquity = q.hasEquity === "true";

        const validator = jsonschema.validate(q, jobSearchSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }

        const jobs = await Job.findAll(q);
        return res.json({jobs});
    }catch(e){
        return next(e)
    }
});

// GET a job
router.get("/:id",async function(req,res,next){
    try{
        const job = await Job.get(req.params.id)
        return res.json({job})
    }catch(e){
        return next(e)
    }
})

// PATCH a job
router.patch("/:id",ensureAdmin,async function(req,res,next){
    try{
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }

        const job = await Job.update(req.params.id,req.body);
        return res.json({job});
    }catch(e){
        return next(e)
    }
})

// DELETE a job
router.delete("/:id",ensureAdmin,async function(req,res,next){
    try{
        await Job.remove(req.params.id);
        return res.json({deleted: req.params.id})
    }catch(e){
        return next(e);
    }
})




module.exports = router;