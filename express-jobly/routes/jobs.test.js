"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
  testJobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// POST JOBs
describe("POST /jobs", function(){
    const newJob = {
        title:"test",
        salary: 100,
        equity: "0",
        companyHandle: "c2",
    };

    test("works for admin",async function(){
        const res = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            job : {...newJob, id :expect.any(Number)},
        });
    });

    test("fail for user",async function(){
        const res = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);
        expect(res.statusCode).toEqual(401);
    });

    test("fail for missing data",async function(){
        const res = await request(app)
            .post("/jobs")
            .send({title:"test",})
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400);
    });

    test("fail for invalid data",async function(){
        const res = await request(app)
            .post("/jobs")
            .send({
                title:"test",
                salary: "notNum",
                equity: "notnum",
                companyHandle: "c2",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400);
    });
})

// get all jobs
describe("GET /jobs",function(){
    test("works for anon",async function(){
        const res = await request(app).get("/jobs");
        expect(res.body).toEqual({
            jobs:[
                {
                    id : expect.any(Number),
                    title : "j1",
                    salary : 1000,
                    equity : "0",
                    companyHandle : "c1",
                },
                {
                    id : expect.any(Number),
                    title : "j1",
                    salary : 2000,
                    equity : "0",
                    companyHandle : "c2",
                },
                {
                    id : expect.any(Number),
                    title : "j2",
                    salary : 10000,
                    equity : "0.5",
                    companyHandle : "c1",
                },
            ]
        });
    });

    test("works: filtering title",async function(){
        const res = await request(app).get("/jobs").query({title : "J1"});
        expect(res.body).toEqual({
            jobs :[
                {
                    id : expect.any(Number),
                    title : "j1",
                    salary : 1000,
                    equity : "0",
                    companyHandle : "c1",
                },
                {
                    id : expect.any(Number),
                    title : "j1",
                    salary : 2000,
                    equity : "0",
                    companyHandle : "c2",
                },
            ]
        });
    });

    test("works: filtering minSalary",async function(){
        const res = await request(app).get("/jobs").query({minSalary : 2000});
        expect(res.body).toEqual({
            jobs :[
                {
                    id : expect.any(Number),
                    title : "j1",
                    salary : 2000,
                    equity : "0",
                    companyHandle : "c2",
                },
                {
                    id : expect.any(Number),
                    title : "j2",
                    salary : 10000,
                    equity : "0.5",
                    companyHandle : "c1",
                },
            ]
        });
    });

    test("works: filtering hasEquity",async function(){
        const res = await request(app).get("/jobs").query({hasEquity : true});
        expect(res.body).toEqual({
            jobs :[
                {
                    id : expect.any(Number),
                    title : "j2",
                    salary : 10000,
                    equity : "0.5",
                    companyHandle : "c1",
                },
            ]
        });
    });

    test("works: filtering all",async function(){
        const res = await request(app).get("/jobs").query({
            title : "J1", minSalary : 2000, hasEquity : false});
        expect(res.body).toEqual({
            jobs :[
                {
                    id : expect.any(Number),
                    title : "j1",
                    salary : 2000,
                    equity : "0",
                    companyHandle : "c2",
                },
            ]
        });
    });

    test("fails:invalid query",async function(){
        const res = await request(app).get("/jobs").query({notexist:"blahblahblah"});
        expect(res.statusCode).toEqual(400)
    })
})

// get a job
describe("GET /jobs/:id",function(){
    test("works for anao",async function(){
        const res = await request(app).get(`/jobs/${testJobIds[0]}`);
        expect(res.body).toEqual({
            job : {
                id : testJobIds[0],
                title : "j1",
                salary : 1000,
                equity : "0",
                companyHandle : "c1",
            },
        });
    });

    test("not found for no such job", async function () {
        const resp = await request(app).get(`/jobs/0`);
        expect(resp.statusCode).toEqual(404);
    });
});

// Patch a job
describe("PATCH /jobs/:id",function(){
    test("works for admin",async function(){
        const res = await request(app)
        .patch(`/jobs/${testJobIds[0]}`)
        .send({
            title : "newTitle"
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({
            job : {
                id : testJobIds[0],
                title : "newTitle",
                salary : 1000,
                equity : "0",
                companyHandle : "c1",
            }
        });
    });

    test("fail for users",async function(){
        const res = await request(app)
        .patch(`/jobs/${testJobIds[0]}`)
        .send({
            title : "newTitle"
        })
        .set("authorization", `Bearer ${u1Token}`);
        
        expect(res.statusCode).toEqual(401);
    });

    test("fail for anon",async function(){
        const res = await request(app)
        .patch(`/jobs/${testJobIds[0]}`)
        .send({
            title : "newTitle"
        });
        
        expect(res.statusCode).toEqual(401);
    });

    test("fail for job not found",async function(){
        const res = await request(app)
        .patch(`/jobs/0`)
        .send({
            title : "newTitle"
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(404);
    });

    test("fail for bad request on handle change attempt",async function(){
        const res = await request(app)
        .patch(`/jobs/${testJobIds[0]}`)
        .send({
            handle : "newHandle"
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400);
    });

    test("fail for bad request on invalid data",async function(){
        const res = await request(app)
        .patch(`/jobs/${testJobIds[0]}`)
        .send({
            salary : "notNUm"
        })
        .set("authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(400);
    });
})

// DELETE
describe("DELETE /jobs/:id",function(){
    test("works for admin",async function(){
        const res = await request(app)
            .delete(`/jobs/${testJobIds[0]}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(res.body).toEqual({deleted : `${testJobIds[0]}`})
    });

    test("fail for users", async function(){
        const res = await request(app)
            .delete(`/jobs/${testJobIds[0]}`)
            .set("authorization", `Bearer ${u1Token}`);
            expect(res.statusCode).toEqual(401);
    });

    test("fail for anon", async function(){
        const res = await request(app)
            .delete(`/jobs/${testJobIds[0]}`)
            expect(res.statusCode).toEqual(401);
    });

    test("fail for jobs id not found", async function(){
        const res = await request(app)
            .delete(`/jobs/0`)
            .set("authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toEqual(404);
    });
});