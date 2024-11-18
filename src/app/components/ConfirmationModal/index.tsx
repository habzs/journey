import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    confirmColor?: 'primary' | 'danger' | 'success';
    cancelText?: string;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onOpenChange,
    title = 'Confirm Action',
    description = 'Are you sure? This action cannot be undone.',
    confirmText = 'Confirm',
    confirmColor = 'primary',
    cancelText = 'Cancel',
    onConfirm,
}) => {

    // Handle Confirm button click
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <>
            <Modal
                size='sm'
                placement='center'
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                            <ModalBody>
                                <p>{description}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    {cancelText}
                                </Button>

                                <Button
                                    color={confirmColor}
                                    onPress={handleConfirm}
                                >
                                    {confirmText}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ConfirmationModal;
