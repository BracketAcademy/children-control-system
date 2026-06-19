import DataTable from "../../Components/DataTable/DataTable";

export default function AdmissionPanel({ entryURL, deliverURL, title, icon }) {
  return (
    <div className="panel">
      <DataTable
        entryURL={entryURL}
        deliverURL={deliverURL}
        title={title}
        icon={icon}
      />
    </div>
  );
}
