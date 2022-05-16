const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


// create
describe("create jobs", function(){
    let newJob = {
        title : "new",
        salary: 12345,
        equity: "0",
        companyHandle: "c1",
    };

    test("works", async function(){
        let job = await Job.create(newJob);
        expect(job).toEqual({...newJob, id : expect.any(Number)});

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle AS "companyHandle"
            FROM jobs
            WHERE title = 'new' AND company_handle = 'c1'`);
        expect(result.rows).toEqual([
            {
                ...newJob,
                id : expect.any(Number),
            }
        ]);
    });

    test("bad request with dupe", async ()=>{
        try{
            await Job.create(newJob);
            await Job.create(newJob);
            fail();
        }catch(err){
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
});

// findAll
describe("findAll",function(){
    test("works:no filter", async function(){
        let jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                id : 1,
                title: "j1",
                salary: 12345,
                equity: "0",
                companyHandle: "c1",
            },
            {
                id : 3,
                title: "j1",
                salary: 1234567,
                equity: "0.5",
                companyHandle: "c2",
            },
            {
                id : 2,
                title: "j2",
                salary: 123456,
                equity: "0.5",
                companyHandle: "c1",
            },
        ]);
    });

    test("works:filter by title",async function(){
        let filter = {title:"j1"};
        let jobs = await Job.findAll(filter);
        expect(jobs).toEqual([
            {
                id : 1,
                title: "j1",
                salary: 12345,
                equity: "0",
                companyHandle: "c1",
            },
            {
                id : 3,
                title: "j1",
                salary: 1234567,
                equity: "0.5",
                companyHandle: "c2",
            },
        ])
    });

    test("works:filter by minSalary",async function(){
        let filter = {minSalary: 123456};
        let jobs = await Job.findAll(filter);
        expect(jobs).toEqual([
            {
                id : 3,
                title: "j1",
                salary: 1234567,
                equity: "0.5",
                companyHandle: "c2",
            },
            {
                id : 2,
                title: "j2",
                salary: 123456,
                equity: "0.5",
                companyHandle: "c1",
            },
        ])
    });

    test("works:filter by hasEquity",async function(){
        let filter = {hasEquity : true};
        let jobs = await Job.findAll(filter);
        expect(jobs).toEqual([
            {
                id : 3,
                title: "j1",
                salary: 1234567,
                equity: "0.5",
                companyHandle: "c2",
            },
            {
                id : 2,
                title: "j2",
                salary: 123456,
                equity: "0.5",
                companyHandle: "c1",
            },
        ])
    });

    test("works: filter by hasEquity and minSalary",async function(){
        let jobs = await Job.findAll({hasEquity : true, minSalary: 1234567});
        expect(jobs).toEqual([
            {
                id : 3,
                title: "j1",
                salary: 1234567,
                equity: "0.5",
                companyHandle: "c2",
            },
        ])
    });

    test("works: filter by title, minSalary and hasEquity",async function(){
        let jobs = await Job.findAll({title : "J1", hasEquity : false, minSalary: 12345});
        expect(jobs).toEqual([
            {
                id : 1,
                title: "j1",
                salary: 12345,
                equity: "0",
                companyHandle: "c1",
            },
            {
                id : 3,
                title: "j1",
                salary: 1234567,
                equity: "0.5",
                companyHandle: "c2",
            },
        ])
    });

    test("works: unmatch result by filter title, minSalary and hasEquity",async function(){
        let jobs = await Job.findAll({title : "j3",hasEquity : false, minSalary: 12345});
        expect(jobs).toEqual([])
    });
})

describe("get",function(){
    test("works",async function(){
        let job = await Job.get(1);
        expect(job).toEqual({
            id : 1,
            title: "j1",
            salary: 12345,
            equity: "0",
            companyHandle: "c1",
        })
    })

    test("works: not found job id",async function(){
        try{
            await Job.get(0);
            fail();
        }catch(e){
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe("update",function(){
    const updateData = {
        title : "test",
        salary: 100000,
        equity: "0.1",
    }

    test("works",async function(){
        let job = await Job.update(1,updateData);
        expect(job).toEqual({
            id:1,
            companyHandle : "c1",
            ...updateData,
        })
    });

    test("fail: job not found", async function(){
        try{
            await Job.update(0,updateData);
            fail();
        }catch(e){
            expect(e instanceof NotFoundError).toBeTruthy();
        }
    });

    test("fail:bad request with no data",async function(){
        try{
            await Job.update(1,{});
            fail();
        }catch(e){
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    })
});



describe("delete",function(){
    test("works",async function(){
        await Job.remove(1);
        const res = await db.query("SELECT id FROM jobs WHERE id = 1");
        expect(res.rows.length).toEqual(0);
    })

    test("fail:delete not exist job",async function(){
        try{
            await Job.remove(0);
            fail();
        }catch(err){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
});