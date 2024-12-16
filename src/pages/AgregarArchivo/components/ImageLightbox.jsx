import React from 'react'
import PropTypes from 'prop-types'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

const ImageLightbox = ({ open, index, images, onClose }) => {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={images}
      plugins={[Thumbnails, Zoom, Fullscreen]}
      thumbnails={{
        position: 'start',
        width: 50,
        height: 70,
        border: 1,
        borderRadius: 0,
        showToggle: true
      }}
      zoom={{
        scrollToZoom: true
      }}
    />
  )
}

ImageLightbox.propTypes = {
  open: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired
}

export default ImageLightbox
