import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util"

const Folder: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const folderName = fileData.slug?.split("/").pop() || "Folder"
  
  return (
    <div className={classNames(displayClass, "folder-container")}>
      <h1>{folderName}</h1>
      <p>This is a folder page containing multiple files.</p>
    </div>
  )
}

Folder.css = `
.folder-container {
  margin: 2rem 0;
}

.folder-container h1 {
  color: var(--dark);
  margin-bottom: 1rem;
}

.folder-container p {
  color: var(--gray);
  font-style: italic;
}
`

export default (() => Folder) satisfies QuartzComponentConstructor