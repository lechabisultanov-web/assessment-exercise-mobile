import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  Box,
  Button,
  TextField
} from "@mui/material";

import { useEffect, useState } from "react";
import { exportCustomersToXml } from "../utils/customerXmlExport";
import { getCustomers, type CustomerListQuery } from "../api/customerApi";



export default function CustomerListPage() {
  const [list, setList] = useState<CustomerListQuery[]>([]);
  const [filter, setFilter] = useState("");

   const loadData = async (currentFilter?: string) => {
    try {
      const data = await getCustomers(currentFilter);
      setList(data);
    } catch (error) {
      console.error("Failed to load customers", error);
      setList([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        Customers
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          label="Search by name or email"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={() => loadData(filter)}>
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setFilter("");
            loadData("");
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => exportCustomersToXml(list)}
        >
          Export XML
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customer table">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Name</StyledTableHeadCell>
              <StyledTableHeadCell>Address</StyledTableHeadCell>
              <StyledTableHeadCell>Email</StyledTableHeadCell>
              <StyledTableHeadCell>Phone</StyledTableHeadCell>
              <StyledTableHeadCell>Iban</StyledTableHeadCell>
              <StyledTableHeadCell>Code</StyledTableHeadCell>
              <StyledTableHeadCell>Description</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.iban}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
}));