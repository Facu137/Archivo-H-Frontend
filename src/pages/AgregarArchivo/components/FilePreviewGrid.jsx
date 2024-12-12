import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card, CloseButton, Spinner } from 'react-bootstrap'
import { FaFileImage } from 'react-icons/fa'

const FilePreviewGrid = ({
  files,
  previewUrls,
  dimensions,
  title,
  type,
  loading,
  onRemove,
  onPreviewClick
}) => {
  const isTiffFile = (file) => {
    return (
      file.type === 'image/tiff' ||
      file.name.toLowerCase().endsWith('.tiff') ||
      file.name.toLowerCase().endsWith('.tif')
    )
  }

  const renderPreview = (file, idx) => {
    if (file.type === 'application/pdf') {
      return (
        <div className="ratio ratio-16x9">
          <iframe src={previewUrls[idx]} title={file.name} allowFullScreen />
        </div>
      )
    } else if (isTiffFile(file)) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '120px', backgroundColor: '#f8f9fa' }}
        >
          <FaFileImage size={40} color="#6c757d" />
        </div>
      )
    } else {
      return (
        <Card.Img
          variant="top"
          src={previewUrls[idx]}
          alt={file.name}
          style={{
            objectFit: 'cover',
            height: '120px',
            cursor: 'pointer'
          }}
          onClick={() => onPreviewClick(idx, previewUrls)}
        />
      )
    }
  }

  const renderDimensions = (file, dimensions) => {
    if (isTiffFile(file)) {
      return (
        <Card.Text className="text-muted small mb-0">Archivo TIFF</Card.Text>
      )
    }
    return (
      <Card.Text className="text-muted small mb-0">
        {dimensions?.width}x{dimensions?.height}px
      </Card.Text>
    )
  }

  return (
    <div className="mb-4">
      <h5 className="d-flex align-items-center">
        {title}
        {loading && (
          <Spinner
            animation="border"
            size="sm"
            className="ms-2"
            variant="primary"
          />
        )}
      </h5>
      <Row xs={2} sm={3} md={4} lg={5} className="g-2">
        {files.map((file, idx) => (
          <Col key={`${file.name}-${idx}`}>
            <Card style={{ height: '100%' }}>
              <div className="position-relative">
                <CloseButton
                  className="position-absolute top-0 end-0 m-1"
                  onClick={() => onRemove(idx, type)}
                  style={{ zIndex: 1 }}
                />
                {renderPreview(file, idx)}
              </div>
              <Card.Body className="p-2">
                <Card.Title className="fs-6 text-truncate" title={file.name}>
                  {file.name}
                </Card.Title>
                {renderDimensions(file, dimensions[idx])}
                <Card.Text className="text-muted small">
                  {dimensions[idx]?.size} KB
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

FilePreviewGrid.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  previewUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  dimensions: PropTypes.arrayOf(
    PropTypes.shape({
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      size: PropTypes.string
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['original', 'converted']).isRequired,
  loading: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  onPreviewClick: PropTypes.func.isRequired
}

export default FilePreviewGrid
