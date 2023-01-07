import React from 'react'
import { AiOutlineFileImage } from 'react-icons/ai'
import {
    FaBoxOpen, FaGraduationCap, FaTshirt, FaVestPatches,
} from 'react-icons/fa'
import { GiArmoredPants } from 'react-icons/gi'
import { IoShirtSharp } from 'react-icons/io5'
import { MdInsertPhoto } from 'react-icons/md'
import { BsTriangleFill } from 'react-icons/bs'

/**
 * CategoryIcon
 */
export default function CategoryIcon({ name = 'Other' }: {
    /** Name */
    name: string
}) {
    switch (name) {
        case 'T-Shirt':
            return <IoShirtSharp />
        case 'Sweater':
            return <FaTshirt />
        case 'Long Sleeve':
            return <FaTshirt />
        case 'Patch':
            return <FaVestPatches />
        case 'Trouser':
            return <GiArmoredPants />
        case 'Cap':
            return <FaGraduationCap />
        case 'Poster':
            return <AiOutlineFileImage />
        case 'Photo':
            return <MdInsertPhoto />
        case 'Concert Poster':
            return <AiOutlineFileImage />
        case 'Magazine Poster':
            return <AiOutlineFileImage />
        case 'Pick':
            return <BsTriangleFill />
        default:
            return <FaBoxOpen />
    }
}
