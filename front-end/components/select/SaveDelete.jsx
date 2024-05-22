import { Button } from "@mui/material";
export const SaveDelete = (props) => {
    const handleCancel = () => {
        props.cancel();
    }
    const handleSave = () => {
        props.save();
    }
    const handleDelete = () => {
        props.delete();
    }
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: 6,
            }}
        >
            <Button
                variant="contained"
                sx={{ marginX: 2 }}
                onClick={handleCancel}
            >
                Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
                Save
            </Button>
            <Button
                color="error"
                variant="contained"
                sx={{ marginX: 2 }}
                onClick={handleDelete}
            >
                Delete
            </Button>
        </div>)
}