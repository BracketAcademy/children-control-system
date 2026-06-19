import { useCallback, useEffect, useState } from "react";
import * as kidsApi from "../../api/kids";

export function useKidsTable({ entryURL, deliverURL }) {
  const [data, setData] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedKid, setSelectedKid] = useState(null);

  const getDataIndex = useCallback(
    (record) => {
      if (!data) return -1;
      return data.findIndex((item) => item.id === record.id);
    },
    [data]
  );

  const fetchData = useCallback(() => {
    setLoading(true);
    kidsApi
      .getKids()
      .then((resData) => {
        setLoading(false);
        setData((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(resData)) {
            return resData;
          }
          return prev;
        });
        setFetched(true);
      })
      .catch(() => {
        setLoading(false);
        setError({
          message: "خطا در دریافت اطلاعات",
          description: "اطلاعات به درستی دریافت نشدند، لطفا دوباره تلاش کنید.",
        });
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => {
      setError(null);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [error]);

  const updateKidAtIndex = useCallback((index, updates) => {
    setData((prev) => {
      if (!prev || index === -1) return prev;
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  }, []);

  const entryHandler = useCallback(
    (record) => {
      const index = getDataIndex(record);
      if (index === -1 || !data) return;

      const kid = data[index];
      const gender =
        kid.gender && kid.gender !== "NO"
          ? kid.gender
          : record.gender && record.gender !== "NO"
            ? record.gender
            : kid.gender || "";
      const number = kid.number || "";

      const payLoad = {
        id: record.id,
        number,
        gender,
      };

      const postData = () => {
        kidsApi
          .entry(entryURL, payLoad)
          .then(() => {
            updateKidAtIndex(index, { status: "IN" });
            setLoading(false);
            setError(null);
            fetchData();
          })
          .catch((err) => {
            setLoading(false);
            setError({ message: err.message, description: "" });
          });
      };

      if (
        number.trim() === "000" ||
        gender.trim() === "NO" ||
        number.trim() === "" ||
        gender.trim() === ""
      ) {
        setError({
          message: "اطلاعات ناقص است",
          description: "جنسیت یا شماره وارد نشده است.",
        });
      } else {
        let isUnique = true;
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          if (element.number === number && i !== index) {
            isUnique = false;
            break;
          }
        }
        if (isUnique) {
          setLoading(true);
          postData();
        } else {
          setModal({
            title: "فرد دیگر با همین شماره وجود دارد.",
            onOk: () => {
              postData();
              setModal(null);
              setLoading(true);
            },
            message: "آیا می‌خواهید این فرد را با شماره تکراری ثبت کنید؟",
          });
        }
      }
    },
    [data, entryURL, fetchData, getDataIndex, updateKidAtIndex]
  );

  const deliverHandler = useCallback(
    (record) => {
      const index = getDataIndex(record);
      setLoading(true);
      kidsApi
        .deliver(deliverURL, record.id)
        .then(() => {
          if (index !== -1) {
            updateKidAtIndex(index, { status: "RE" });
          }
          setLoading(false);
          setError(null);
          fetchData();
        })
        .catch((err) => {
          setLoading(false);
          setError({
            message: err.message ? err.message : "خطا",
            description: "",
          });
        });
    },
    [deliverURL, fetchData, getDataIndex, updateKidAtIndex]
  );

  const undoHandler = useCallback(
    (record) => {
      const index = getDataIndex(record);
      if (index === -1 || !data) return;

      setLoading(true);
      let newStatus = "";
      let newGateIN = null;
      let newGateOut = null;

      switch (record.status) {
        case "IN":
          newStatus = "NO";
          newGateIN = "NO";
          break;
        case "RE":
          newStatus = "IN";
          newGateOut = "NO";
          break;
        case "SE":
          newStatus = "IN";
          newGateOut = "NO";
          break;
        case "DE":
          newStatus = "IN";
          newGateOut = "NO";
          break;
        default:
          break;
      }

      const currentKid = data[index];
      const updatedGateIn = newGateIN ? newGateIN : currentKid.gate_in;
      const updatedGateOut = newGateOut ? newGateOut : currentKid.gate_out;

      kidsApi
        .undo(record.id, newStatus)
        .then(() => {
          updateKidAtIndex(index, {
            status: newStatus,
            gate_in: updatedGateIn,
            gate_out: updatedGateOut,
          });
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError({ message: err.message, description: "" });
        });
    },
    [data, getDataIndex, updateKidAtIndex]
  );

  const updateKidField = useCallback((index, field, value) => {
    setData((prev) => {
      if (!prev || index === -1) return prev;
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const openKidModal = useCallback((record) => {
    setSelectedKid(record);
  }, []);

  return {
    data,
    setData,
    fetched,
    loading,
    error,
    setError,
    modal,
    setModal,
    selectedKid,
    setSelectedKid,
    getDataIndex,
    fetchData,
    entryHandler,
    deliverHandler,
    undoHandler,
    updateKidField,
    openKidModal,
  };
}
