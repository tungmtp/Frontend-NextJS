import { Button } from "@mui/material";
export const SaveCancel = (props) => {
    const handleCancel = () => {
        props.cancel();
    }
    const handleSave = () => {
        props.save();
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

        </div>)
}