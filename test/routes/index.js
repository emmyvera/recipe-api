import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../index.js";

const { expect } = chai;

chai.use(chaiHttp);

describe("User Routes", () => {
  it("should list all users on /api/users GET", (done) => {
    chai
      .request(app)
      .get("/api/users")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message").eql("List of users");
        done();
      });
  });
});
