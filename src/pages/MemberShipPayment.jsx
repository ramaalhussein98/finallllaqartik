import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaymentsContainer } from "../styledComponents/Payments";
import { MuiFileInput } from "mui-file-input";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
const MemberShipPayment = () => {
  const data = useLocation().state?.data;
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const nav = useNavigate();

  const [checked, setChecked] = useState(false);
  const [coupon, setCoupon] = useState(0);
  const [couponInputValue, setCouponInputValue] = useState();
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [couponId, setCouponId] = useState();
  const [file, setFile] = useState(null);
  const [finalPrice, setFinalPrice] = useState();
  const [calcPriceWithDiscount, setCalcPriceWithDiscount] = useState();
  const [calcPriceWithTaxa, setCalcPriceWithTaxa] = useState();
  const [btnDisabled, setBtnDisabled] = useState(false);
  // console.log(data);

  useEffect(() => {
    if (data) {
      const calcPrice1 = (data.price * coupon) / 100;
      setCalcPriceWithDiscount(calcPrice1);
      const calculatedPrice1 = data.price - calcPrice1;
      // console.log(calculatedPrice1);

      const calcPrice2 = (calculatedPrice1 * 15) / 100;
      setCalcPriceWithTaxa(calcPrice2);
      const calculatedPrice2 = calculatedPrice1 + calcPrice2;

      // console.log(calculatedPrice2);
      setFinalPrice(calculatedPrice2);
    }
  }, [coupon]);

  const handleFileChange = (newValue) => {
    setFile(newValue);
    // console.log(newValue);
  };

  const handleAcceptAllChange = (e) => {
    // console.log(e.target);
    setChecked((prev) => !prev);
  };

  const handleCouponClick = () => {
    setIsCouponOpen((prev) => !prev);
  };

  const handleCouponChange = (e) => {
    setCouponInputValue(e.target.value);
  };

  const handleCheckCouponBtn = async (e) => {
    // console.log(coupon);
    // e.target.disabled = true;
    const token = localStorage.getItem("user_token");
    const res = await axios.get(
      `https://www.dashboard.aqartik.com/api/memberships/check_coupon?code=${couponInputValue}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.status === 1) {
      toast.success(lang === "ar" ? "اكتملت عملية التحقق" : "done");
      setCouponId(res.data.coupon.id);
      setCoupon(res.data.coupon.ratio);
      setIsCouponValid(true);
    } else if (
      res.data.status === 0 &&
      res.data.message === "401 Unauthorized"
    ) {
      toast.error(
        lang === "ar"
          ? "غير مصرح، يرجى تسجيل الدخول"
          : "unauthorized, please login again"
      );
      localStorage.removeItem("user_token");
    } else if (
      res.data.status === 0 &&
      res.data.message === "الكود المدخل غير صالح"
    ) {
      toast.error(
        lang === "ar" ? "الكود المدخل غير صالح" : "coupon code isn't valid!"
      );
      // localStorage.removeItem("user_token");
    }
  };

  const submitPayment = async (e) => {
    setBtnDisabled(true);

    if (checked) {
      if (file) {
        const token = localStorage.getItem("user_token");
        const formData = new FormData();
        formData.append("membership_id", data?.id);
        if (couponId) {
          formData.append("coupon_id", couponId);
        }
        formData.append("image", file);
        const res = await axios.post(
          `https://www.dashboard.aqartik.com/api/memberships/membership_subscription?lang=${lang}`,
          formData,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.status === 1) {
          setTimeout(() => {
            nav("/");
          }, 1000);
          setBtnDisabled(false);
          toast.success(res.data.message);
        } else if (res.data.status === 0) {
          toast.success(res.data.message);
          setBtnDisabled(false);
        } else if (
          res.data.status === 0 &&
          res.data.message === "401 Unauthorized"
        ) {
          toast.error(
            lang === "ar"
              ? "غير مصرح، يرجى تسجيل الدخول"
              : "unauthorized, please login again"
          );
          localStorage.removeItem("user_token");
          localStorage.removeItem("userData");
          localStorage.removeItem("userMembership");
          localStorage.removeItem("userLocation");
          setBtnDisabled(false);
        } else {
        }
      } else {
        setBtnDisabled(false);

        toast.error(
          lang === "ar"
            ? "يرجى التأكد من  رفع ايصال الدفع"
            : "Please make sure to upload the payment receipt"
        );
      }
    } else {
      setBtnDisabled(false);
      toast.error(
        lang === "ar"
          ? "يرجى الموافقة على الشروط والأحكام"
          : "Please accept the terms and conditions"
      );
    }
  };

  return (
    <PaymentsContainer>
      <h2>{lang === "ar" ? "الدفع" : "payment"}</h2>
      <div className="container">
        <div className="sec1">
          <span>{lang === "ar" ? "الملخص" : "summary"}</span>
          <div className="summary">
            <p className="sumEle">
              <span>{lang === "ar" ? "اسم العضوية" : "membership name"}:</span>
              <span>
                {data && lang === "ar" ? data?.ar_name : data?.en_name}
              </span>
            </p>
            <p className="sumEle">
              <span>{lang === "ar" ? "السعر" : "price"}:</span>
              <span>
                {data && data?.price.toFixed(2)} {t("currency")}
              </span>
            </p>
            <p className="sumEle">
              <span>{lang === "ar" ? "الخصم" : "discount"}:</span>
              <span
                style={{
                  color: "#e62e2e",
                }}
              >
                {calcPriceWithDiscount?.toFixed(2)} {t("currency")}
              </span>
            </p>
            <p className="sumEle">
              <span>
                {lang === "ar" ? "ضريبة القيمة المضافة " : "VAT "}(15%):
              </span>
              <span>
                {calcPriceWithTaxa?.toFixed(2)} {t("currency")}
              </span>
            </p>
            <p className="sumEle">
              <span>{lang === "ar" ? "المجموع الكلي" : "total price"}:</span>
              <span style={{ color: "#14b183" }}>
                {finalPrice?.toFixed(2)} {t("currency")}
              </span>
            </p>
          </div>
          <div className="acceptAndCoupon">
            <FormControlLabel
              label={
                <>
                  <span>
                    {lang === "ar" ? "أوافق على " : "I agree to the "}
                  </span>
                  <Link to={"/privacy"}>
                    {lang === "ar" ? "الشروط والأحكام" : "privacy and policy"}
                  </Link>
                </>
              }
              sx={{
                textDecoration: "none",
                color: "black",
                fontSize: "14px",
                marginRight: "0",
                marginLeft: "0",
              }}
              control={
                <Checkbox
                  checked={checked}
                  onChange={(e) => handleAcceptAllChange(e)}
                  sx={{
                    color: "#14b183",
                    "&.Mui-checked": {
                      color: "#14b183",
                    },
                  }}
                />
              }
            />
            {!isCouponValid && (
              <div onClick={handleCouponClick} className="coupon">
                {lang === "ar" ? "لديك كوبون خصم؟" : "have a coupon?"}
              </div>
            )}
          </div>
          {isCouponOpen && !isCouponValid && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <label htmlFor="outlined-basic">
                {lang === "ar" ? "ادخال الكوبون" : "insert coupon"}
              </label>
              <div className="checkCouponCon">
                <TextField
                  className="couponText"
                  value={couponInputValue}
                  onChange={(e) => handleCouponChange(e)}
                  size="small"
                  id="outlined-basic"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#14b183", // Change this to your desired focused color
                      },
                  }}
                />
                <Button
                  onClick={(e) => handleCheckCouponBtn(e)}
                  className="checkCoupon"
                >
                  {lang === "ar" ? "تحقق" : "checkout"}
                </Button>
              </div>
            </div>
          )}
        </div>
        <hr />
        <div className="sec2">
          <span>{lang === "ar" ? "ايصال الدفع" : "payment receipt"}</span>
          <MuiFileInput
            size="small"
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#14b183", // Change this to your desired focused color
                },
            }}
            value={file}
            onChange={handleFileChange}
          />
        </div>
        <Button
          disabled={btnDisabled}
          id="submitBtn"
          onClick={(e) => submitPayment(e)}
          className="submit"
        >
          {lang === "ar" ? "إرسال الطلب" : "send request"}
        </Button>
      </div>
    </PaymentsContainer>
  );
};

export default MemberShipPayment;
