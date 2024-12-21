import Appbar from "@/components/CodeRooms/WorkSpace/Appbar"


export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col justify-center items-center h-screen w-full ">
            <Appbar />
            {children}
        </div>
    )
}