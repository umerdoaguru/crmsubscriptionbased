import React from "react";
import img from "../images/2.png";
import styled from "styled-components";

function Frontendpage({ quotationName }) {
  return (
    <Wrapper>
      <div className="">
        
        <div className="">
          <div className="row">
            <div className="col-12">
              <img src={img} style={{ width: "inherit" }} />
              <div className="bottomleft text-white">
                <h1>Plans & Quotation for</h1>
                <h1 className="hdd">{quotationName}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Frontendpage;
const Wrapper = styled.div`
  .container-fluid {
    position: relative;
  }

  .bottomleft {
    position: absolute;
    bottom: 100px;
    left: 40px;
    font-size: 18px;
  }
  .hdd {
    font-size: 3rem;
  }
`;
