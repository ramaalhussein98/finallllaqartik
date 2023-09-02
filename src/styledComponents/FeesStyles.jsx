import { styled } from "styled-components";

export const FeesContainer = styled.main`
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

    @media (max-width: 650px) {
      /* Adjust styles for screens with a maximum width of 768px */
      width: 90%;
    }

    .dealsContainer {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .dealElement {
        width: 100%;
        background-color: rgb(245, 245, 245);
        border: 1px solid #cccbcb;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          padding: 8px;
        }

        .dealAmount {
          background-color: rgb(255, 255, 255);
          padding: 8px;
          color: #14b183;
          font-weight: 600;
          border-right: 1px solid #cccbcb;
        }
      }
    }
    .dealInfo {
      margin: 16px 0;
      font-size: 14px;

      p {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    hr {
      border: 1px solid #cccbcb;
    }

    .userTypeContainer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 16px 0;
    }

    .packages {
      display: flex;
      gap: 8px;
      align-items: start;

      .package {
        border: 1px solid #cccbcb;
        display: flex;
        border-radius: 4px;
        /* width: 150px; */
        flex: 1;
        height: 120px;
        flex-direction: column;
        justify-content: space-between;

        .header {
          background-color: #f7f7f7;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 5px;
          text-align: center;
          cursor: pointer;

          img {
            width: 30px;
            height: 30px;
          }

          span {
            font-size: 14px;
          }
        }

        .footer {
          padding: 8px;
          text-align: center;
          border-top: 1px solid #cccbcb;
        }
      }
    }

    .link {
      text-align: center;
      margin: 8px 0;

      a {
        text-decoration: none;
      }
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
  }
`;
