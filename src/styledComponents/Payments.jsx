import { styled } from "styled-components";

export const PaymentsContainer = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(245, 245, 245);
  flex-direction: column;
  gap: 16px;

  .container {
    width: 40%;
    min-width: 350px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #cccbcb;
    border-radius: 6px;
    padding: 32px 16px;

    hr {
      border: 1px solid #cccbcb;
      margin: 16px 0;
    }

    .summary {
      margin-top: 16px;
      width: 100%;
      background-color: rgb(245, 245, 245);
      border: 1px solid #cccbcb;
      border-radius: 4px;
      display: flex;
      padding: 16px 8px;
      flex-direction: column;

      .sumEle {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        align-items: center;
      }
    }

    .acceptAndCoupon {
      display: flex;
      align-items: start;
      justify-content: space-between;

      .coupon {
        font-size: 14px;
        color: #ec9b1e;
        font-weight: 600;
        cursor: pointer;
      }
    }

    .sec2 {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 16px;
    }

    .submit {
      text-align: center;
      cursor: pointer;
      padding: 12px 0;
      border: none;
      border-radius: 4px;
      outline: none;
      background-color: #14b183;
      color: white;
    }

    .checkCouponCon {
      display: flex;
      gap: 8px;
      align-items: stretch;

      .couponText {
        flex: 1;
      }

      .checkCoupon {
        background-color: #14b183;
        color: white;
        padding: 8px;
        text-align: center;
        cursor: pointer;
        border: none;
        width: 100px;
        outline: none;
        border-radius: 4px;
      }
    }
  }
`;
