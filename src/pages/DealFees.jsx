import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import useDataFetcher from "../api/useDataFetcher ";
import { pkg1, pkg2, pkg3 } from "../assets";
import GeneralContext from "../context/generalContext";
import { FeesContainer } from "../styledComponents/FeesStyles";

const customFormControlClass = {
  flexFlow: "row",
  display: "flex",
  width: "100%",
};

const DealFees = () => {
  const { t, i18n } = useTranslation();
  const nav = useNavigate();
  const lang = i18n.language;

  const [radioSelected, setRadioSelected] = useState("");
  const [additionalRadioSelected, setAdditionalRadioSelected] = useState("");
  const [showAdditionalBox, setShowAdditionalBox] = useState();

  const { generalData } = useContext(GeneralContext);
  const [memberships, setmemberships] = useState();
  const { data, isLoading, get } = useDataFetcher();

  useEffect(() => {
    get("/api/memberships/all");
  }, []);

  useEffect(() => {
    if (data) {
      setmemberships(data.memberships);
    }
  }, [data]);
  // console.log(memberships);
  useEffect(() => {}, []);

  const deals = [
    {
      ar_title: "رسوم البيع",
      en_title: "Selling fees",
      amount: generalData.selling_fee,
    },
    {
      ar_title: "رسوم التأجير الشهري",
      en_title: "Monthly rental fees",
      amount: generalData.monthly_rental_fee,
    },
    {
      ar_title: "رسوم التأجير اليومي",
      en_title: "Daily rental fees",
      amount: generalData.daily_rental_fee,
    },
  ];

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setRadioSelected(value);
    if (value === "option2") {
      setShowAdditionalBox(true);
    } else {
      setShowAdditionalBox(false);
      setAdditionalRadioSelected("");
    }
  };

  const handleClickMembership = (data) => {
    nav("/membershipPayment", { state: { data: data } });
  };

  const handleGoToAdd = () => {
    nav("/addDeal");
  };

  return (
    <FeesContainer>
      <h2>{lang === "ar" ? "رسوم الإعلان" : "Deal fees"}</h2>
      <div className="container">
        <div className="dealsContainer">
          {deals.map((deal, index) => (
            <div className="dealElement">
              <span>{lang === "ar" ? deal.ar_title : deal.en_title}</span>
              <div className="dealAmount">
                {deal.amount ? deal.amount + " " + t("currency") : ""}
              </div>
            </div>
          ))}
        </div>
        <div className="dealInfo">
          <p>
            <span>-</span>
            <span>
              {lang === "ar"
                ? "تدفع الرسوم فقط بعد بيع أو تأجير العقار"
                : "Fees are paid only after the sale or rental of the property"}
            </span>
          </p>
          <p>
            <span>-</span>
            <span>
              {lang === "ar"
                ? "تنطبق الرسوم على أي عملية يقوم بها عميل توصل إليك عبر التطبيق ولو كان العقار غير معروض بالتطبيق"
                : "The fees apply to any transaction made by a client who reached you through the application, even if the property is not displayed on the application"}
            </span>
          </p>
        </div>
        <hr />

        <div className="userTypeContainer">
          <p>{lang === "ar" ? "هل أنت؟" : "are you?"}</p>
          <FormControl
            component="fieldset"
            sx={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              flexFlow: "row",
              ".css-17pr1ty-MuiFormGroup-root": {
                display: "row",
                flexDirection: "row",
                flexFlow: "row",
                width: "100%",
              },
              "&.css-3oog02": customFormControlClass,
              "& .MuiFormGroup-root": {
                width: "100%",
                flexFlow: "row",
              },
            }}
          >
            <RadioGroup
              name={`radio-group`}
              value={radioSelected}
              onChange={handleRadioChange}
              sx={{ display: "flex" }}
            >
              {["option1", "option2"]?.map((value, index) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio sx={{ opacity: "0" }} />}
                  label={
                    value === "option1"
                      ? lang === "ar"
                        ? "مالك / وكيل"
                        : "Owner / agent"
                      : value === "option2"
                      ? lang === "ar"
                        ? "مسوق / مكتب"
                        : "Marketer / office"
                      : ""
                  }
                  sx={{
                    backgroundColor:
                      radioSelected === value ? "var(--green-color)" : "white",
                    color: radioSelected === value ? "white" : "black",
                    border: "1px solid #cdcdcd",
                    // width: "30%",
                    flex: "1",
                    marginX: "0",
                    borderRadius: value === "option3" ? "4px" : "0",
                    padding: "0.3rem",
                    position: "relative",
                    "& .MuiFormControlLabel-label": {
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    },
                  }}
                  name={`custom-radio-${index}`} // Add the index to the name prop
                />
              ))}
            </RadioGroup>
          </FormControl>
          <span>
            {lang === "ar"
              ? "تعفى جميع الاشتراكات من رسوم البيع والتأجير لمدة عام كامل"
              : "All subscriptions are exempt from sale and rental fees for a full year"}
          </span>
        </div>
        {showAdditionalBox && (
          <>
            <div className="packages">
              {memberships?.map((ele, i) => (
                <div
                  onClick={() => handleClickMembership(ele)}
                  className="package"
                >
                  <div className="header">
                    <img
                      src={
                        i === 0 ? pkg2 : i === 1 ? pkg3 : i === 2 ? pkg1 : ""
                      }
                      alt=""
                    />
                    <span>{lang === "ar" ? ele.ar_name : ele.en_name}</span>
                  </div>
                  <div className="footer">
                    {ele.price + " " + t("currency")}
                  </div>
                </div>
              ))}
            </div>

            <div className="link">
              <Link to={"/memberships"}>
                {lang === "ar"
                  ? "اضغط هنا لمشاهدة مميزات الباقات والاشتراك فيها"
                  : "Click here to view the features of the packages and subscribe to them"}
              </Link>
            </div>
          </>
        )}

        <div onClick={handleGoToAdd} className="submit">
          {lang === "ar" ? "أتعهد بدفع الرسوم" : "I swear to pay the fees"}
        </div>
      </div>
    </FeesContainer>
  );
};

export default DealFees;
