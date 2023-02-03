const chai=require("chai");
const chaihttp=require("chai-http");
const index =require("../index");

chai.should();
chai.use(chaihttp); //to call api request

describe("Blogs api for logged In users",()=>{
    //test get
    describe("get all blogs",()=>{
        it("It should return a array of all blogs",(done)=>{
            chai.request(index)
            .get("/api/blog")
            .end((err,response)=>{
                 response.should.have.status(200);
                 response.body.should.be.a('array');
                done();
            })

        })
    })
    
    authToken="";
    describe("login",()=>{
        myaccount={
            email:"test@test.com",
            password:"test"
        }
        it("this is login test",(done)=>{
            chai.request(index)
            .post('/api/auth/login')
            .send(myaccount)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('authtoken');
                authToken=res.body.authtoken
                done();
            })
        })
    })

    CreatedBlog={}
    describe("Create Blog",()=>{
        newBlog={
            title:'This is the test ',
            description:'this blog is created by test'
        }
        it("This is blog created by loggedIn user",(done)=>{
            chai.request(index)
            .post('/api/blog/addblog')
            .send(newBlog)
            .set('auth-token',authToken)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('createdBy');
                res.body.should.have.property('createdOn');

                CreatedBlog=res.body;
                done();
            })
        })
    })

    describe("Update Blog",()=>{
        updatedBlog={
            description:'this blog is updated by test'
        }
        it("This is blog updated by loggedIn user",(done)=>{
            chai.request(index)
            .put('/api/blog/'+CreatedBlog._id)
            .send(updatedBlog)
            .set('auth-token',authToken)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('Success');
                res.body.should.have.property('blog');

                done();
            })
        })
    })

    describe("Delete Blog",()=>{
        it("This is blog deleted by loggedIn user",(done)=>{
            chai.request(index)
            .delete('/api/blog/'+CreatedBlog._id)
            .set('auth-token',authToken)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('Success');
                res.body.should.have.property('blog');

                done();
            })
        })
    })


})

describe("Blogs api for logged Out users",()=>{

    //no auth token without login

    CreatedBlog={}
    describe("Create Blog without login",()=>{
        newBlog={
            title:'This is the test ',
            description:'this blog is created by test'
        }
        it("This is blog created by logged out user giving error",(done)=>{
            chai.request(index)
            .post('/api/blog/addblog')
            .send(newBlog)
            .end((err,res)=>{
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('error');

                CreatedBlog=res.body;
                done();
            })
        })
    })

    describe("Update Blog without login",()=>{
        updatedBlog={
            description:'this blog is updated by test'
        }
        it("This is blog updated by logged out user giving error",(done)=>{
            chai.request(index)
            .put('/api/blog/'+CreatedBlog._id)
            .send(updatedBlog)
            .end((err,res)=>{
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('error');

                done();
            })
        })
    })

    describe("Delete Blog without login",()=>{
        it("This is blog deleted by logged out user giving error",(done)=>{
            chai.request(index)
            .delete('/api/blog/'+CreatedBlog._id)
            .end((err,res)=>{
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('error');

                done();
            })
        })
    })


})