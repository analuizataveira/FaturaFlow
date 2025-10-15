/* eslint-disable @typescript-eslint/no-unused-expressions */

import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import {
  PaginationItem,
  PaginationLink,
  PaginationContainer,
  PaginationContent,
} from './_components/pagination-components'
import ChevronLeft from '../../icons/chevron-left'
import ChevronRight from '../../icons/chevron-right'

export interface PaginationProps {
  totalPages: number
  currentPage: number
  buttonsToShow?: number
  onPageChange?: (page: number) => void
}

export function Pagination({
  totalPages,
  currentPage,
  buttonsToShow = 5,
  onPageChange,
}: PaginationProps) {
  const middle =
    buttonsToShow % 2 === 0 ? buttonsToShow / 2 : (buttonsToShow - 1) / 2
  const getItem = (page: number) => {
    return (
      <PaginationItem key={`pagination-button-${page}`}>
        <PaginationLink
          isActive={currentPage === page}
          onClick={() =>
            currentPage !== page && onPageChange && onPageChange(page)
          }
          size={undefined}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    )
  }

  function getPaginationItems() {
    const items = []
    let start = 1
    let end = totalPages

    if (totalPages <= buttonsToShow) {
      start = 1
      end = totalPages
    } else if (currentPage < buttonsToShow) {
      start = 1
      end = buttonsToShow
    } else {
      if (currentPage > totalPages - buttonsToShow + 1) {
        start = totalPages - buttonsToShow + 1
        end = totalPages
      } else if (currentPage > middle) {
        start = currentPage - middle + 1
        end = currentPage + middle - 1
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(getItem(i))
    }

    return items
  }

  function handlePrevious() {
    if (currentPage > 1) {
      onPageChange && onPageChange(currentPage - 1)
    }
  }

  function handleNext() {
    if (currentPage < totalPages) {
      onPageChange && onPageChange(currentPage + 1)
    }
  }

  function goToFirst() {
    onPageChange && onPageChange(1)
  }

  function goToLast() {
    onPageChange && onPageChange(totalPages)
  }

  function handlePreviousVisible() {
    if (totalPages <= buttonsToShow) return false
    if (currentPage < buttonsToShow) return false
    return true
  }

  function handleNextVisible() {
    if (totalPages <= buttonsToShow) return false
    if (currentPage > totalPages - buttonsToShow + 1) return false
    return true
  }

  return (
    <PaginationContainer>
      <PaginationContent>
        {handlePreviousVisible() && (
          <>
            <PaginationItem>
              <PaginationLink onClick={goToFirst} size={undefined}>
                <DoubleArrowLeftIcon className='size-4 fill-primary stroke-primary' />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={handlePrevious} size={undefined}>
                <ChevronLeft className='size-3 fill-primary stroke-primary stroke-[0.2]' />
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {getPaginationItems()}
        {handleNextVisible() && (
          <>
            <PaginationItem>
              <PaginationLink onClick={handleNext} size={undefined}>
                <ChevronRight className='size-3 fill-primary stroke-primary stroke-[0.2]' />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={goToLast} size={undefined}>
                <DoubleArrowRightIcon className='size-4 fill-primary stroke-primary' />
              </PaginationLink>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </PaginationContainer>
  )
}
